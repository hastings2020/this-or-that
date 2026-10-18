import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";
import { randomBytes, randomUUID } from "node:crypto";
import { SEED_QUESTIONS } from "./seeds";
import type {
  AppUser,
  OptionComparison,
  OptionWithVotes,
  QuestionComparison,
  QuestionDetail,
  QuestionSummary,
  TeamDetail,
  TeamMemberProgress,
  TeamQuestionProgress,
  TeamResults,
  TeamSummary,
  VoterIdentity,
} from "./types";

const dataDir = path.join(process.cwd(), "data");
const dbPath = path.join(dataDir, "this-or-that.sqlite");

let db: Database.Database | null = null;

function getDb() {
  if (db) return db;

  fs.mkdirSync(dataDir, { recursive: true });
  db = new Database(dbPath);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");

  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      image TEXT,
      password_hash TEXT,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS questions (
      id TEXT PRIMARY KEY,
      prompt TEXT NOT NULL UNIQUE,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS options (
      id TEXT PRIMARY KEY,
      question_id TEXT NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
      label TEXT NOT NULL,
      sort_order INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS votes (
      id TEXT PRIMARY KEY,
      question_id TEXT NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
      option_id TEXT NOT NULL REFERENCES options(id) ON DELETE CASCADE,
      username TEXT NOT NULL,
      user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
      created_at TEXT NOT NULL,
      UNIQUE(question_id, username)
    );

    CREATE TABLE IF NOT EXISTS teams (
      id TEXT PRIMARY KEY,
      code TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      expected_members INTEGER,
      created_at TEXT NOT NULL,
      created_by TEXT NOT NULL,
      created_by_user_id TEXT REFERENCES users(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS team_questions (
      team_id TEXT NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
      question_id TEXT NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
      sort_order INTEGER NOT NULL,
      PRIMARY KEY (team_id, question_id)
    );

    CREATE TABLE IF NOT EXISTS team_members (
      team_id TEXT NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
      username TEXT NOT NULL,
      user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
      joined_at TEXT NOT NULL,
      PRIMARY KEY (team_id, username)
    );

    CREATE INDEX IF NOT EXISTS idx_options_question ON options(question_id);
    CREATE INDEX IF NOT EXISTS idx_votes_question ON votes(question_id);
    CREATE INDEX IF NOT EXISTS idx_votes_user ON votes(user_id);
    CREATE INDEX IF NOT EXISTS idx_team_questions_team ON team_questions(team_id);
    CREATE INDEX IF NOT EXISTS idx_team_members_team ON team_members(team_id);
  `);

  ensureSeedQuestions(db);
  return db;
}

function ensureSeedQuestions(database: Database.Database) {
  const existing = new Set(
    (
      database.prepare("SELECT prompt FROM questions").all() as {
        prompt: string;
      }[]
    ).map((row) => row.prompt),
  );

  const insertQuestion = database.prepare(
    "INSERT INTO questions (id, prompt, created_at) VALUES (?, ?, ?)",
  );
  const insertOption = database.prepare(
    "INSERT INTO options (id, question_id, label, sort_order) VALUES (?, ?, ?, ?)",
  );

  const now = new Date().toISOString();
  const tx = database.transaction(() => {
    for (const seed of SEED_QUESTIONS) {
      if (existing.has(seed.prompt)) continue;
      const questionId = randomUUID();
      insertQuestion.run(questionId, seed.prompt, now);
      seed.options.forEach((label, index) => {
        insertOption.run(randomUUID(), questionId, label, index);
      });
    }
  });
  tx();
}

function makeTeamCode() {
  return randomBytes(4).toString("hex");
}

export function normalizeUsername(username: string) {
  return username.trim().replace(/\s+/g, " ");
}

export function createUser(input: {
  email: string;
  name: string;
  passwordHash: string;
}): AppUser {
  const email = input.email.trim().toLowerCase();
  const name = normalizeUsername(input.name);
  if (!email || !email.includes("@")) throw new Error("Valid email is required.");
  if (!name) throw new Error("Display name is required.");
  if (name.length > 32) throw new Error("Display name must be 32 characters or fewer.");

  const database = getDb();
  const existing = database
    .prepare("SELECT id FROM users WHERE email = ?")
    .get(email);
  if (existing) throw new Error("An account with that email already exists.");

  const id = randomUUID();
  const createdAt = new Date().toISOString();
  database
    .prepare(
      `INSERT INTO users (id, email, name, image, password_hash, created_at)
       VALUES (?, ?, ?, NULL, ?, ?)`,
    )
    .run(id, email, name, input.passwordHash, createdAt);

  return {
    id,
    email,
    name,
    image: null,
    passwordHash: input.passwordHash,
    createdAt,
  };
}

export function getUserByEmail(email: string): AppUser | null {
  const row = getDb()
    .prepare(
      `SELECT id, email, name, image, password_hash AS passwordHash, created_at AS createdAt
       FROM users WHERE email = ?`,
    )
    .get(email.trim().toLowerCase()) as AppUser | undefined;
  return row ?? null;
}

export function getUserById(id: string): AppUser | null {
  const row = getDb()
    .prepare(
      `SELECT id, email, name, image, password_hash AS passwordHash, created_at AS createdAt
       FROM users WHERE id = ?`,
    )
    .get(id) as AppUser | undefined;
  return row ?? null;
}

export function upsertOAuthUser(input: {
  email: string;
  name: string;
  image?: string | null;
}): AppUser {
  const email = input.email.trim().toLowerCase();
  const name = normalizeUsername(input.name) || email.split("@")[0];
  const existing = getUserByEmail(email);
  if (existing) {
    getDb()
      .prepare("UPDATE users SET name = ?, image = COALESCE(?, image) WHERE id = ?")
      .run(name, input.image ?? null, existing.id);
    return getUserById(existing.id)!;
  }

  const id = randomUUID();
  const createdAt = new Date().toISOString();
  getDb()
    .prepare(
      `INSERT INTO users (id, email, name, image, password_hash, created_at)
       VALUES (?, ?, ?, ?, NULL, ?)`,
    )
    .run(id, email, name, input.image ?? null, createdAt);
  return getUserById(id)!;
}

export function listQuestions(): QuestionSummary[] {
  return getDb()
    .prepare(
      `
      SELECT
        q.id,
        q.prompt,
        q.created_at AS createdAt,
        (SELECT COUNT(*) FROM options o WHERE o.question_id = q.id) AS optionCount,
        (SELECT COUNT(*) FROM votes v WHERE v.question_id = q.id) AS totalVotes
      FROM questions q
      ORDER BY q.created_at ASC, q.prompt ASC
    `,
    )
    .all() as QuestionSummary[];
}

export function countQuestions() {
  return (
    getDb().prepare("SELECT COUNT(*) AS c FROM questions").get() as { c: number }
  ).c;
}

export function getQuestion(
  id: string,
  username?: string | null,
): QuestionDetail | null {
  const database = getDb();
  const question = database
    .prepare(
      "SELECT id, prompt, created_at AS createdAt FROM questions WHERE id = ?",
    )
    .get(id) as { id: string; prompt: string; createdAt: string } | undefined;
  if (!question) return null;

  const options = database
    .prepare(
      `
      SELECT
        o.id,
        o.label,
        o.sort_order AS sortOrder,
        (SELECT COUNT(*) FROM votes v WHERE v.option_id = o.id) AS votes
      FROM options o
      WHERE o.question_id = ?
      ORDER BY o.sort_order ASC
    `,
    )
    .all(id) as OptionWithVotes[];

  let userVoteOptionId: string | null = null;
  if (username) {
    const vote = database
      .prepare(
        "SELECT option_id AS optionId FROM votes WHERE question_id = ? AND username = ?",
      )
      .get(id, normalizeUsername(username)) as
      | { optionId: string }
      | undefined;
    userVoteOptionId = vote?.optionId ?? null;
  }

  return {
    ...question,
    options,
    totalVotes: options.reduce((sum, option) => sum + option.votes, 0),
    userVoteOptionId,
  };
}

export function createQuestion(prompt: string, optionLabels: string[]) {
  const cleanedPrompt = prompt.trim();
  const cleanedOptions = optionLabels.map((label) => label.trim()).filter(Boolean);
  if (!cleanedPrompt) throw new Error("Prompt is required.");
  if (cleanedOptions.length < 2 || cleanedOptions.length > 6) {
    throw new Error("Provide between 2 and 6 options.");
  }

  const database = getDb();
  if (database.prepare("SELECT id FROM questions WHERE prompt = ?").get(cleanedPrompt)) {
    throw new Error("A question with that prompt already exists.");
  }

  const id = randomUUID();
  const now = new Date().toISOString();
  const tx = database.transaction(() => {
    database
      .prepare("INSERT INTO questions (id, prompt, created_at) VALUES (?, ?, ?)")
      .run(id, cleanedPrompt, now);
    const insertOption = database.prepare(
      "INSERT INTO options (id, question_id, label, sort_order) VALUES (?, ?, ?, ?)",
    );
    cleanedOptions.forEach((label, index) => {
      insertOption.run(randomUUID(), id, label, index);
    });
  });
  tx();
  return getQuestion(id);
}

export function castVote(
  questionId: string,
  optionId: string,
  identity: VoterIdentity,
): QuestionDetail {
  const cleanedUsername = normalizeUsername(identity.username);
  if (!cleanedUsername) throw new Error("Username is required.");
  if (cleanedUsername.length > 32) {
    throw new Error("Username must be 32 characters or fewer.");
  }

  const database = getDb();
  if (!database.prepare("SELECT id FROM questions WHERE id = ?").get(questionId)) {
    throw new Error("Question not found.");
  }
  if (
    !database
      .prepare("SELECT id FROM options WHERE id = ? AND question_id = ?")
      .get(optionId, questionId)
  ) {
    throw new Error("Option not found for this question.");
  }

  const userId = identity.userId ?? null;
  const existing = database
    .prepare("SELECT id FROM votes WHERE question_id = ? AND username = ?")
    .get(questionId, cleanedUsername) as { id: string } | undefined;

  if (existing) {
    database
      .prepare(
        "UPDATE votes SET option_id = ?, user_id = COALESCE(?, user_id), created_at = ? WHERE id = ?",
      )
      .run(optionId, userId, new Date().toISOString(), existing.id);
  } else {
    database
      .prepare(
        `INSERT INTO votes (id, question_id, option_id, username, user_id, created_at)
         VALUES (?, ?, ?, ?, ?, ?)`,
      )
      .run(
        randomUUID(),
        questionId,
        optionId,
        cleanedUsername,
        userId,
        new Date().toISOString(),
      );
  }

  const detail = getQuestion(questionId, cleanedUsername);
  if (!detail) throw new Error("Question not found.");
  return detail;
}

export function createTeam(input: {
  name: string;
  createdBy: string;
  createdByUserId?: string | null;
  expectedMembers?: number | null;
  questionCount?: number | null;
  questionIds?: string[] | null;
}): TeamDetail {
  const name = input.name.trim();
  const createdBy = normalizeUsername(input.createdBy);
  if (!name) throw new Error("Team name is required.");
  if (!createdBy) throw new Error("Creator username is required.");

  const database = getDb();
  const allIds = (
    database.prepare("SELECT id FROM questions ORDER BY created_at ASC").all() as {
      id: string;
    }[]
  ).map((row) => row.id);
  if (allIds.length === 0) throw new Error("No questions available yet.");

  let selectedIds: string[];
  if (input.questionIds && input.questionIds.length > 0) {
    const valid = [...new Set(input.questionIds)].filter((id) => allIds.includes(id));
    if (valid.length < 2) throw new Error("Pick at least 2 valid questions.");
    selectedIds = valid;
  } else {
    const requested = input.questionCount ?? Math.min(12, allIds.length);
    const count = Math.max(2, Math.min(allIds.length, requested));
    selectedIds = shuffle(allIds).slice(0, count);
  }

  const expected =
    input.expectedMembers == null || Number.isNaN(input.expectedMembers)
      ? null
      : Math.max(1, Math.min(100, Math.floor(input.expectedMembers)));

  const id = randomUUID();
  let code = makeTeamCode();
  while (database.prepare("SELECT id FROM teams WHERE code = ?").get(code)) {
    code = makeTeamCode();
  }

  const now = new Date().toISOString();
  const tx = database.transaction(() => {
    database
      .prepare(
        `INSERT INTO teams (id, code, name, expected_members, created_at, created_by, created_by_user_id)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
      )
      .run(id, code, name, expected, now, createdBy, input.createdByUserId ?? null);
    const insertQ = database.prepare(
      "INSERT INTO team_questions (team_id, question_id, sort_order) VALUES (?, ?, ?)",
    );
    selectedIds.forEach((questionId, index) => insertQ.run(id, questionId, index));
    database
      .prepare(
        "INSERT INTO team_members (team_id, username, user_id, joined_at) VALUES (?, ?, ?, ?)",
      )
      .run(id, createdBy, input.createdByUserId ?? null, now);
  });
  tx();

  const detail = getTeamByCode(code, createdBy);
  if (!detail) throw new Error("Could not create team.");
  return detail;
}

export function joinTeam(
  code: string,
  identity: VoterIdentity,
): TeamDetail {
  const cleaned = normalizeUsername(identity.username);
  if (!cleaned) throw new Error("Username is required.");

  const database = getDb();
  const team = database
    .prepare("SELECT id, code FROM teams WHERE code = ?")
    .get(code.trim().toLowerCase()) as { id: string; code: string } | undefined;
  if (!team) throw new Error("Team not found.");

  database
    .prepare(
      `INSERT INTO team_members (team_id, username, user_id, joined_at)
       VALUES (?, ?, ?, ?)
       ON CONFLICT(team_id, username) DO UPDATE SET
         user_id = COALESCE(excluded.user_id, team_members.user_id)`,
    )
    .run(team.id, cleaned, identity.userId ?? null, new Date().toISOString());

  const detail = getTeamByCode(team.code, cleaned);
  if (!detail) throw new Error("Team not found.");
  return detail;
}

export function getTeamByCode(
  code: string,
  username?: string | null,
): TeamDetail | null {
  const database = getDb();
  const team = database
    .prepare(
      `SELECT id, code, name, expected_members AS expectedMembers,
              created_at AS createdAt, created_by AS createdBy
       FROM teams WHERE code = ?`,
    )
    .get(code.trim().toLowerCase()) as
    | {
        id: string;
        code: string;
        name: string;
        expectedMembers: number | null;
        createdAt: string;
        createdBy: string;
      }
    | undefined;
  if (!team) return null;

  const questionCount = (
    database
      .prepare("SELECT COUNT(*) AS c FROM team_questions WHERE team_id = ?")
      .get(team.id) as { c: number }
  ).c;

  const members = getTeamMembers(team.id, questionCount);
  const completedMemberCount = members.filter((m) => m.complete).length;
  const cleanedUsername = username ? normalizeUsername(username) : null;

  const questions = (
    database
      .prepare(
        `
        SELECT q.id, q.prompt, tq.sort_order AS sortOrder,
          (SELECT COUNT(*) FROM votes v WHERE v.question_id = q.id) AS totalVotes
        FROM team_questions tq
        JOIN questions q ON q.id = tq.question_id
        WHERE tq.team_id = ?
        ORDER BY tq.sort_order ASC
      `,
      )
      .all(team.id) as Omit<TeamQuestionProgress, "userVoteOptionId">[]
  ).map((question) => {
    let userVoteOptionId: string | null = null;
    if (cleanedUsername) {
      const vote = database
        .prepare(
          "SELECT option_id AS optionId FROM votes WHERE question_id = ? AND username = ?",
        )
        .get(question.id, cleanedUsername) as { optionId: string } | undefined;
      userVoteOptionId = vote?.optionId ?? null;
    }
    return { ...question, userVoteOptionId };
  });

  return {
    ...team,
    questionCount,
    memberCount: members.length,
    completedMemberCount,
    allComplete: members.length > 0 && completedMemberCount === members.length,
    members,
    questions,
  };
}

export function getTeamResults(code: string): TeamResults | null {
  const database = getDb();
  const teamRow = database
    .prepare(
      `SELECT id, code, name, expected_members AS expectedMembers,
              created_at AS createdAt, created_by AS createdBy
       FROM teams WHERE code = ?`,
    )
    .get(code.trim().toLowerCase()) as
    | {
        id: string;
        code: string;
        name: string;
        expectedMembers: number | null;
        createdAt: string;
        createdBy: string;
      }
    | undefined;
  if (!teamRow) return null;

  const questionCount = (
    database
      .prepare("SELECT COUNT(*) AS c FROM team_questions WHERE team_id = ?")
      .get(teamRow.id) as { c: number }
  ).c;
  const members = getTeamMembers(teamRow.id, questionCount);
  const completedMemberCount = members.filter((m) => m.complete).length;
  const memberSet = new Set(members.map((m) => m.username));

  const packQuestions = database
    .prepare(
      `
      SELECT q.id, q.prompt, tq.sort_order AS sortOrder
      FROM team_questions tq
      JOIN questions q ON q.id = tq.question_id
      WHERE tq.team_id = ?
      ORDER BY tq.sort_order ASC
    `,
    )
    .all(teamRow.id) as { id: string; prompt: string; sortOrder: number }[];

  const comparisons: QuestionComparison[] = packQuestions.map((question) => {
    const options = database
      .prepare(
        `SELECT id, label, sort_order AS sortOrder FROM options
         WHERE question_id = ? ORDER BY sort_order ASC`,
      )
      .all(question.id) as { id: string; label: string; sortOrder: number }[];

    const votes = database
      .prepare(
        `SELECT option_id AS optionId, username FROM votes WHERE question_id = ?`,
      )
      .all(question.id) as { optionId: string; username: string }[];

    const optionComparisons: OptionComparison[] = options.map((option) => {
      let groupVotes = 0;
      let worldVotes = 0;
      for (const vote of votes) {
        if (vote.optionId !== option.id) continue;
        if (memberSet.has(vote.username)) groupVotes += 1;
        else worldVotes += 1;
      }
      return {
        id: option.id,
        label: option.label,
        sortOrder: option.sortOrder,
        groupVotes,
        worldVotes,
      };
    });

    const groupTotal = optionComparisons.reduce((s, o) => s + o.groupVotes, 0);
    const worldTotal = optionComparisons.reduce((s, o) => s + o.worldVotes, 0);

    return {
      id: question.id,
      prompt: question.prompt,
      sortOrder: question.sortOrder,
      groupTotal,
      worldTotal,
      groupWinnerLabel: winnerLabel(optionComparisons, "groupVotes"),
      worldWinnerLabel: winnerLabel(optionComparisons, "worldVotes"),
      options: optionComparisons,
    };
  });

  const team: TeamSummary = {
    ...teamRow,
    questionCount,
    memberCount: members.length,
    completedMemberCount,
    allComplete: members.length > 0 && completedMemberCount === members.length,
  };

  return { team, members, comparisons };
}

function getTeamMembers(teamId: string, questionCount: number): TeamMemberProgress[] {
  const database = getDb();
  const members = database
    .prepare(
      `SELECT username, joined_at AS joinedAt FROM team_members
       WHERE team_id = ? ORDER BY joined_at ASC`,
    )
    .all(teamId) as { username: string; joinedAt: string }[];

  const answeredStmt = database.prepare(
    `SELECT COUNT(*) AS c FROM votes v
     JOIN team_questions tq ON tq.question_id = v.question_id
     WHERE tq.team_id = ? AND v.username = ?`,
  );

  return members.map((member) => {
    const answeredCount = (
      answeredStmt.get(teamId, member.username) as { c: number }
    ).c;
    return {
      ...member,
      answeredCount,
      complete: questionCount > 0 && answeredCount >= questionCount,
    };
  });
}

function winnerLabel(
  options: OptionComparison[],
  key: "groupVotes" | "worldVotes",
): string | null {
  if (options.length === 0) return null;
  const max = Math.max(...options.map((o) => o[key]));
  if (max <= 0) return null;
  const winners = options.filter((o) => o[key] === max);
  return winners.length === 1
    ? winners[0].label
    : winners.map((o) => o.label).join(" / ");
}

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

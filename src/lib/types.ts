export type OptionWithVotes = {
  id: string;
  label: string;
  sortOrder: number;
  votes: number;
};

export type QuestionSummary = {
  id: string;
  prompt: string;
  createdAt: string;
  optionCount: number;
  totalVotes: number;
};

export type QuestionDetail = {
  id: string;
  prompt: string;
  createdAt: string;
  options: OptionWithVotes[];
  totalVotes: number;
  userVoteOptionId: string | null;
};

export type AppUser = {
  id: string;
  email: string;
  name: string;
  image: string | null;
  passwordHash: string | null;
  createdAt: string;
};

export type TeamMemberProgress = {
  username: string;
  joinedAt: string;
  answeredCount: number;
  complete: boolean;
};

export type TeamQuestionProgress = {
  id: string;
  prompt: string;
  sortOrder: number;
  totalVotes: number;
  userVoteOptionId: string | null;
};

export type TeamDetail = {
  id: string;
  code: string;
  name: string;
  expectedMembers: number | null;
  createdAt: string;
  createdBy: string;
  questionCount: number;
  memberCount: number;
  completedMemberCount: number;
  allComplete: boolean;
  members: TeamMemberProgress[];
  questions: TeamQuestionProgress[];
};

export type TeamSummary = {
  id: string;
  code: string;
  name: string;
  expectedMembers: number | null;
  createdAt: string;
  createdBy: string;
  questionCount: number;
  memberCount: number;
  completedMemberCount: number;
  allComplete: boolean;
};

export type OptionComparison = {
  id: string;
  label: string;
  sortOrder: number;
  groupVotes: number;
  worldVotes: number;
};

export type QuestionComparison = {
  id: string;
  prompt: string;
  sortOrder: number;
  groupTotal: number;
  worldTotal: number;
  groupWinnerLabel: string | null;
  worldWinnerLabel: string | null;
  options: OptionComparison[];
};

export type TeamResults = {
  team: TeamSummary;
  members: TeamMemberProgress[];
  comparisons: QuestionComparison[];
};

export type VoterIdentity = {
  username: string;
  userId?: string | null;
};

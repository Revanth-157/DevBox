export interface TerminalCommandRecord {
  id: string;
  title: string;
  command: string;
  description: string;
  os: string;
  tags: string[];
  favorite: boolean;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface CreateTerminalCommandInput {
  title: string;
  command: string;
  description?: string;
  os: string;
  tags?: string[];
  favorite?: boolean;
}

export interface UpdateTerminalCommandInput extends Partial<CreateTerminalCommandInput> {}

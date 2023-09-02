export interface IGameType {
  id?: string;
  name: string;
  nameKo: string;
  order: number;
  isActive: boolean;
  isAutoResult: boolean;
  isAutoRegistration: boolean;
  gameCategoryId?: string;
}

export interface IGameConfig {
  id?: string;
  name?: string;
  gameTypes: IGameType[];
}

export interface IUpdateGameConfig {
  data: IGameType[];
}

export interface IGameAmount {
  id: string;
}

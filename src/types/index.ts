export interface Furnizor {
  id: string;
  nume: string;
  telefon: string;
  email?: string;
  companie?: string;
  creat_la: string;
  claimed?: boolean;
}

export interface Recenzie {
  id?: string;
  mesaj: string;
  rating: number;
  data: string;
  timestamp?: Date;
  furnizorId?: string;
  nume_furnizor?: string;
  telefon?: string;
}

export interface RecenzieWithFurnizor extends Recenzie {
  furnizorId: string;
  nume_furnizor: string;
  telefon: string;
}

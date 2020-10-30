import ILoggedUserResponseDTO from './ILoggedUserResponseDTO';

export default interface ICreateSessionResponseDTO {
  user: ILoggedUserResponseDTO;
  token: string;
}

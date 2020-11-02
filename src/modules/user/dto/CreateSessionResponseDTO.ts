import LoggedUserDTO from './LoggedUserDTO';

export default interface CreateSessionResponseDTO {
  user: LoggedUserDTO;
  token: string;
}

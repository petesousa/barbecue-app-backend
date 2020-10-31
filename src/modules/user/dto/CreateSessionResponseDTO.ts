import LoggedUserResponseDTO from './LoggedUserResponseDTO';

export default interface CreateSessionResponseDTO {
  user: LoggedUserResponseDTO;
  token: string;
}

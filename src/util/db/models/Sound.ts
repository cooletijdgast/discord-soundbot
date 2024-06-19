import { RowDataPacket } from 'mysql2'

export default interface Sound extends RowDataPacket{
  id?: number;
  name?: string;
  count?: number;
}
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateProjectWikiDto {
  @ApiProperty({ description: '위키 마크다운 내용' })
  @IsString()
  readonly wikiContent: string;
}

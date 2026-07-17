import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import type { Bi, PostInput, PublishInput } from '@portfolio/contracts';

/** A value required in both locales. */
export class BiDto implements Bi {
  @IsString()
  @IsNotEmpty()
  es!: string;

  @IsString()
  @IsNotEmpty()
  en!: string;
}

export class PostDto implements PostInput {
  @IsOptional()
  @IsString()
  slug?: string;

  @IsString()
  @IsNotEmpty()
  tag!: string;

  @ValidateNested()
  @Type(() => BiDto)
  title!: BiDto;

  @ValidateNested()
  @Type(() => BiDto)
  excerpt!: BiDto;

  @ValidateNested()
  @Type(() => BiDto)
  body!: BiDto;

  @IsOptional()
  @IsBoolean()
  published?: boolean;
}

export class PublishDto implements PublishInput {
  @IsBoolean()
  published!: boolean;
}

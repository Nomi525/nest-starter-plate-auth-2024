import { ImageSize } from "@prisma/client";
import EnumProperty from "../../common/utils/annotations/dto/enum.property";
import { CreatedIdDto } from "../repositories/dtos/created-id.dto";
import RequiredStringProperty from "../../common/utils/annotations/dto/required-string.property";
import { IsJWT } from "class-validator";

export class ImageSizeDto {
  @EnumProperty(ImageSize, "size of image")
  size: ImageSize;
}

export class UploadedFileDto extends CreatedIdDto {
  @RequiredStringProperty("token for immediate image access after upload")
  @IsJWT()
  token: string;
}

export class UploadedFileRoleDto {
  @RequiredStringProperty("name of the action to be performed like upload userProfile or food product")
  role: string; // for fallback image placeholder...like userProfile, product(food-menu-item)
}

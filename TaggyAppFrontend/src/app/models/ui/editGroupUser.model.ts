import { GetGroupUserDto } from "../dtos/groupUser/getGroupUserDto";

export class EditGroupUserModel {
    dto : GetGroupUserDto;
    editing : boolean;

    constructor(dto : GetGroupUserDto, editing : boolean = false) {
        this.dto = dto;
        this.editing = editing;
    }
}
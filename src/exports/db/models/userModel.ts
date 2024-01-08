import { DataTypes } from "sequelize";
import {db} from "../connection";

export const UserModel = db.define('user', {
    discord_id: {
        type: DataTypes.STRING
    },
    global_name: {
        type: DataTypes.STRING
    }
});
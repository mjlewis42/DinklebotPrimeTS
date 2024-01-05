import {UserModel} from "../db/models/userModel";

export class User {
    private readonly userId: number;
    private readonly global_name: string;
    constructor(id: number, gName: string){
        this.userId = id;
        this.global_name = gName;
    }
    public  async getCreateUser(){
        let getUser: any = await this.findUser();
        if(!getUser) getUser = await this.createUser();
        return getUser;
    };
    public async findUser(){ return await UserModel.findOne({where: {discord_id: this.userId}, raw: true}); };
    public async createUser(){
        console.log(`${new Date().toLocaleString()} : CREATING new USER ${this.userId} -> @${this.global_name}`);
        return await UserModel.create({discord_id: this.userId, global_name: this.global_name});
    };
    public deleteUser(){};
}

class Economy extends User {
    public checkFunds(){
        //see if exists, then return
    };
    public payUser(){
        //see if both users exist, then check funds, then return
    };
}
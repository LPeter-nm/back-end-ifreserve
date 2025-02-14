import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/PrismaService';

@Injectable()
export class UserService {
    constructor(private readonly prisma: PrismaService){}

    register(body) {
        
    }
}

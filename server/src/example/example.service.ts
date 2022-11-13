import { Injectable } from '@nestjs/common';
import { Example as ExampleModel, Prisma } from '@prisma/client';
import { PrismaService } from 'src/common/prisma/prisma.service';

@Injectable()
export class ExampleService {
  constructor(private readonly prismaSerivce: PrismaService) {}

  async findExample(exampleWhereUniqueInput: Prisma.ExampleWhereUniqueInput): Promise<ExampleModel> {
    return await this.prismaSerivce.example.findUnique({
      where: exampleWhereUniqueInput,
    });
  }

  async findExamples(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.ExampleWhereUniqueInput;
    where?: Prisma.ExampleWhereInput;
    orderBy?: Prisma.ExampleOrderByWithRelationInput;
  }) {
    const { skip, take, cursor, where, orderBy } = params;
    return await this.prismaSerivce.example.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }
}

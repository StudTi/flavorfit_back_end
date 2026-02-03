import { Injectable } from '@nestjs/common'
import { hash } from 'argon2'
import type { Prisma } from 'prisma/generated/prisma/client'
import { PrismaService } from 'src/prisma/prisma.service'
import { UserUpdateInput } from './input/user-update.input'

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) { }
  
  async findAll() {
    return this.prisma.user.findMany()
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: {
        id
      }, 
      include: {
        measurements: true,
        profile: true
      }
    })
  }

  async findByEmail(email:string){
    return this.prisma.user.findFirst({
        where: { 
          email: {
            equals: email,
            mode: 'insensitive'
        }
      }
    })
  }

  async updateProfile(id: string, input: UserUpdateInput) {
    const { profile, measurements, password, ...data } = input
    
    const updateProfile: Prisma.XOR<
      Prisma.UserUpdateInput,
      Prisma.UserUncheckedCreateInput
    > = profile
      ? {
          profile: {
            upsert: {
              create: profile as Prisma.ProfileCreateWithoutUserInput,
              update: profile as Prisma.ProfileUpdateWithoutUserInput
            }
          }
        }
      : {}
   
    const updateMeasurements: Prisma.XOR<
      Prisma.UserUpdateInput,
      Prisma.UserUncheckedUpdateInput
      > = measurements
      ? {
          measurements: {
            upsert: {
              create: measurements,
              update: measurements
            }
          }
        }
      : {}
    
      console.log('password', password)
    
    const hashedPassword =
      password && typeof password == 'string'
      ? {
          password: await hash(password)
        }
        : {}
    
      return this.prisma.user.update({
        where: { id }, 
        data: {
          ...hashedPassword,
          ...updateProfile,
          ...updateMeasurements,
          email: data.email, 
        },
        include: {
          measurements: true,
          profile: true
        }
      })
  }
}


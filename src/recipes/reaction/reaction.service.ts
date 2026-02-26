import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CommentCreateInput, CommentUpdateInput } from './inputs/comment.input';
import { Role } from 'prisma/generated/prisma/enums';

@Injectable()
export class ReactionService {
  constructor(private readonly prisma: PrismaService) { }
  
//*                    TOGGLE LIKE

  async toggleLike(userId: string, recipeId: string) {
    const existingLike = await this.prisma.like.findUnique({
      where: {
        recipeId_userId: {
          recipeId,
          userId
        }
      }
    })
    if (existingLike) {
      await this.prisma.like.delete({
        where: {
          id: existingLike.id
        }
      })
      return { liked:false }
    } else {
      await this.prisma.like.create({
        data: {
          user: {
            connect: { id: userId }
          },
          recipe: {
            connect: { id: recipeId }
          }
        }
      })
      return { liked: true }
    }
  }

//*                       CREATE COMMENT

  createComment(userId: string, input: CommentCreateInput) {
    return this.prisma.comment.create({
      data: {
        content: input.content,
        author: {
          connect: { id: userId }
        },
        recipe: {
          connect: { id: input.recipeId }
        }
      }
    })
  }

//*                     UPDATE COMMENT

  async updateComment(
    userId: string,
    userRole: Role,
    commentId: string,
    input: CommentUpdateInput
  ) {
    const comment = await this.prisma.comment.findUnique({
      where: { id:commentId }
    })

    if (!comment || (comment.authorId != userId && userRole != Role.ADMIN)) {
      throw new ForbiddenException ('Comment not found or unauthorized')
    }

    return this.prisma.comment.update({
      where: { id: commentId },
      data: {
        content: input.content
      },
      include: {
        author: true
      }
    })
  }

//*                     DELETE COMMENT

  async deleteComment(userId: string, userRole: Role, commentId: string) {
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId }
    })
  
    if (!comment || (comment.authorId != userId && userRole != Role.ADMIN)) {
      throw new ForbiddenException('Comment not found or unauthorized')
    }

    return this.prisma.comment.delete({
      where: { id:commentId }
    })
  }
}

import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { ReactionService } from './reaction.service';
import { CommentModel } from './models/comment.model';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CurrentUser } from 'src/auth/decorators/current-user.decorators';
import { CommentCreateInput, CommentUpdateInput } from './inputs/comment.input';
import type { Role } from 'prisma/generated/graphql/prisma';
import { ToggleLikeResponse } from './models/toggle-like.response';

@Resolver()
export class ReactionResolver {
  constructor(private readonly reactionService: ReactionService) { }
  
//* Создание комментария

  @Mutation(() => CommentModel)
  @Auth()
  createComment(
    @CurrentUser('id') userId: string,
    @Args('input') input: CommentCreateInput
  ) {
    return this.reactionService.createComment(userId, input)
  }

//* Редактирование комментрия 

  @Mutation(() => CommentModel)
  @Auth()
  updateComment(
    @CurrentUser('id') userId: string,
    @CurrentUser('role') userRole: Role,
    @Args('commentId') commentId: string,
    @Args('input') input: CommentUpdateInput
  ) {
    return this.reactionService.updateComment(
      userId,
      userRole,
      commentId,
      input
    )
  }

//* Удаление комментария

  @Mutation(() => CommentModel)
  @Auth()
  deleteComment(
    @CurrentUser('id') userId: string,
    @CurrentUser('role') userRole: Role,
    @Args('commentId') commentId: string
  ) {
    return this.reactionService.deleteComment(userId, userRole, commentId)
  }

//* Лайки

  @Mutation(() => ToggleLikeResponse)
  @Auth()
  toggleLike(
    @CurrentUser('id') userId: string,
    @Args('recipeId') recipeId: string
  ) {
    return this.reactionService.toggleLike(userId, recipeId)
  }
}

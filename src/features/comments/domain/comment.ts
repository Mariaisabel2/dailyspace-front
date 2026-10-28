export interface Comment {
  id: number;
  content: string;
  userId: number;
  userName: string;
  postId: number;
  postTitle?: string;
  createdAt: string;
}

export interface CreateCommentDto {
  postId: number;
  content: string;
}

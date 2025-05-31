import express from "express";
import prisma from "../prisma/client";
import { verifyToken } from "../middlewares/authMiddleware";

const postRouter = express.Router();

postRouter.post("/", verifyToken, async (req, res) => {
  const { text, imageUrl, isPrivate } = req.body;
  const user = (req as any).user;

  try {
    const newPost = await prisma.post.create({
      data: {
        text,
        imageUrl,
        isPrivate: isPrivate || false,
        authorId: user.id,
      },
    });
    res.status(201).json(newPost);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create post" });
  }
});

postRouter.get("/me", verifyToken, async (req, res) => {
  const userId = (req as any).user.id;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      username: true,
      email: true,
      profilePicture: true,
      createdAt: true,
    },
  });

  res.json(user);
});
postRouter.get("/newspaper", verifyToken, async (req, res) => {
  const user = (req as any).user;

  try {
    const friends = await prisma.friendship.findMany({
      where: { OR: [{ userId: user.id }, { friendId: user.id }] },
    });

    const friendIds = new Set<number>();
    friends.forEach(({ userId, friendId }) => {
      const differentId = userId === user.id ? friendId : userId;
      friendIds.add(differentId);
    });

    const posts = await prisma.post.findMany({
      where: {
        OR: [
          { isPrivate: false }, // public for everyone
          { authorId: user.id }, // including own private posts
          {
            // including private posts of friends
            isPrivate: true,
            authorId: { in: Array.from(friendIds) },
          },
        ],
      },
      orderBy: { createdAt: "desc" },
      include: {
        author: {
          select: { id: true, username: true, profilePicture: true },
        },
      },
    });

    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch personalized activities" });
  }
});

postRouter.get("/:userId", verifyToken, async (req, res) => {
  const viewerId = (req as any).user.id;
  const targetUserId = parseInt(req.params.userId);

  const isFriend = await prisma.friendship.findFirst({
    where: {
      OR: [
        { userId: viewerId, friendId: targetUserId },
        { userId: targetUserId, friendId: viewerId },
      ],
    },
  });

  const posts = await prisma.post.findMany({
    where: {
      authorId: targetUserId,
      ...(isFriend || viewerId === targetUserId
        ? {} // show all
        : { isPrivate: false }), // filter out private posts if not friend
    },
    orderBy: { createdAt: "desc" },
  });

  res.json(posts);
});

export default postRouter;

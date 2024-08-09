import { database } from "../adapters/database";

interface fileProps {
  title: string;
  name: string;
  slug: string;
  icon: string;
  type: string;
  size: number;
  categoryId: string;
  email: string;
}

const findFiles = async () => {
  const files = await database.file.findMany({});

  return files;
};

const findByUser = async (userEmail: string) => {
  const user = await database.user.findUnique({
    where: {
      email: userEmail,
    },
    include: { files: true },
  });

  if (user) {
    return user.files;
  }
  return [];
};

const findCategories = async () => {
  const categories = await database.fileCategory.findMany({});

  return categories;
};

const findSlug = async (fileSlug: string) => {
  const file = await database.file.findUnique({
    where: {
      slug: fileSlug,
    },
  });

  return file;
};

const fileDelete = async (filename: string) => {
  const name = await database.file.delete({
    where: {
      name: filename,
    },
  });

  return name;
};

const create = async (file: fileProps) => {
  const { email } = file;

  const user = await database.user.findUnique({
    where: {
      email,
    },
  });

  if (user) {
    return database.file.create({
      data: {
        title: file.title,
        name: file.name,
        slug: file.slug,
        icon: file.icon,
        type: file.type,
        size: file.size,
        userId: user.id,
      },
    });
  } else {
    return " falha de usuario";
  }
};

export default {
  findFiles,
  findCategories,
  create,
  findSlug,
  findByUser,
  fileDelete,
};

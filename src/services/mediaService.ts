import { type } from "os";
import { validateLocaleAndSetLanguage } from "typescript";
import { database } from "./../adapters/database";

const findMedias = async () => {
  const medias = await database.media.findMany({
    include: {
      category: true,
    },
  });

  return medias;
};

const findCategories = async () => {
  const categories = await database.mediaCategory.findMany({});

  return categories;
};

const findSlug = async (fileSlug: string) => {
  const file = await database.media.findUnique({
    where: {
      slug: fileSlug,
    },
  });

  return file;
};

interface mediaProps {
  title: string;
  name: string;
  slug: string;
  icon: string;
  type: string;
  size: number;
  categoryId: string;
}

const create = async (media: mediaProps) => {
  return database.media.create({
    data: {
      title: media.title,
      name: media.name,
      slug: media.slug,
      icon: media.icon,
      type: media.type,
      size: media.size,
      categoryId: media.categoryId,
    },
  });
};

export default { findMedias, findCategories, create, findSlug };

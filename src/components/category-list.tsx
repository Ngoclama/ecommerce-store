import { Category } from "@/types";
import Link from "next/link";
import Image from "next/image";

interface CategoryListProps {
  items: Category[];
}

const CategoryList: React.FC<CategoryListProps> = ({ items }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {items.map((item) => (
        <Link
          key={item.id}
          href={`/category/${item.id}`}
          className="group block bg-gray-100 dark:bg-gray-800 rounded-lg p-4 text-center hover:shadow-lg transition-shadow"
        >
          <div className="relative h-24 w-24 mx-auto mb-4">
            <Image
              src={item.billboard.imageUrl || "/placeholder.png"}
              alt={item.name}
              fill
              className="object-cover rounded-full"
            />
          </div>
          <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
            {item.name}
          </h3>
        </Link>
      ))}
    </div>
  );
};

export default CategoryList;
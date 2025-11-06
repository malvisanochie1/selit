import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar } from "@radix-ui/react-avatar";
import { MessageCircle } from "lucide-react";
import Image from "next/image";

interface SellerComment {
  id: number;
  user: {
    name: string;
    avatar: string;
  };
  timestamp: string;
  text: string;
  rating: number;
  verifiedPurchase: boolean;
  productBought?: string;
}

export function ProfileComments() {
  const comments: SellerComment[] = [
    {
      id: 1,
      user: {
        name: "Sarah Johnson",
        avatar: "/user/avatar1.png",
      },
      timestamp: "2 days ago",
      text: "She is absolutely legit! The product quality was exactly as described and her customer service is top-notch. Initially had my doubts but after trying, I can confidently recommend buying from her. Fast delivery and great communication throughout.",
      rating: 5,
      verifiedPurchase: true,
      productBought: "Premium Study Notes",
    },
    {
      id: 2,
      user: {
        name: "Michael Chen",
        avatar: "/user/avatar2.png",
      },
      timestamp: "1 week ago",
      text: "A very trustworthy seller. I've bought multiple items and each transaction was smooth. Quick responses to messages and very professional. Would definitely buy from again!",
      rating: 5,
      verifiedPurchase: true,
      productBought: "Course Materials Bundle",
    },
  ];

  return (
    <Card className="p-4">
      <h2 className="mb-4 text-lg font-semibold text-foreground">
        Profile Comments
      </h2>

      <div className="space-y-6">
        {comments.map((comment) => (
          <div
            key={comment.id}
            className="flex flex-col space-y-3 border-b border-border pb-6 last:border-0"
          >
            <div className="flex items-start space-x-4">
              <div className="h-10 w-10 rounded-full bg-gray-200">
                <Image
                  src={comment.user.avatar}
                  alt={comment.user.name}
                  width={40}
                  height={40}
                  className="h-full w-full rounded-full object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-foreground">
                        {comment.user.name}
                      </h3>
                      {comment.verifiedPurchase && (
                        <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700">
                          Verified Purchase
                        </span>
                      )}
                    </div>
                    {comment.productBought && (
                      <p className="text-xs text-muted-foreground">
                        Bought: {comment.productBought}
                      </p>
                    )}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {comment.timestamp}
                  </span>
                </div>
                <div className="mt-1 flex items-center">
                  {[...Array(5)].map((_, index) => (
                    <svg
                      key={index}
                      className={`h-4 w-4 ${
                        index < comment.rating
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="mt-2 text-sm text-foreground">{comment.text}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Button className="mt-6 w-full" variant="outline">
        View All Seller Reviews
      </Button>
    </Card>
  );
}

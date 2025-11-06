import { Card } from "@/components/ui/card"
import { FiStar } from "react-icons/fi"

interface Product {
  name: string
  rating: number
  reviews: number
}

export default function ProductReviews({ product }: { product: Product }) {
  // Mock reviews - can be extended to fetch from a database
  const reviews = [
    {
      id: 1,
      author: "Sarah M.",
      rating: 5,
      date: "2 weeks ago",
      verified: true,
      text: "Excellent quality and fast shipping!",
    },
    {
      id: 2,
      author: "John D.",
      rating: 4,
      date: "1 month ago",
      verified: true,
      text: "Great product, could be a bit cheaper.",
    },
    {
      id: 3,
      author: "Emma L.",
      rating: 5,
      date: "1 month ago",
      verified: true,
      text: "Highly recommend! Best purchase ever.",
    },
  ]

  return (
    <Card className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Reviews</h2>
          <p className="mt-1 text-sm text-muted-foreground">{product.reviews} total reviews</p>
        </div>
        <button className="text-sm font-semibold text-foreground hover:underline">View All</button>
      </div>

      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="border-b border-border pb-4 last:border-0">
            <div className="mb-2 flex items-center justify-between">
              <div>
                <p className="font-semibold text-foreground">{review.author}</p>
                {review.verified && <p className="text-xs text-muted-foreground">Verified Purchase</p>}
              </div>
              <p className="text-xs text-muted-foreground">{review.date}</p>
            </div>

            <div className="mb-2 flex gap-1">
              {[...Array(5)].map((_, i) => (
                <FiStar
                  key={i}
                  size={14}
                  className={i < review.rating ? "fill-foreground text-foreground" : "text-border"}
                />
              ))}
            </div>

            <p className="text-sm text-foreground">{review.text}</p>
          </div>
        ))}
      </div>
    </Card>
  )
}

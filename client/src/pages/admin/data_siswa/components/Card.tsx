import { ReactNode } from "react";
import {
  Card as CardElement,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface CardProps {
  title?: string,
  description?: string
}

const Card = ({ children, title, description } : CardProps & { children: ReactNode }) => {
  return (
    <CardElement>
      <CardHeader className="pb-1">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="py-3 text-primary">{children}</CardContent>
    </CardElement>
  );
};

export default Card;

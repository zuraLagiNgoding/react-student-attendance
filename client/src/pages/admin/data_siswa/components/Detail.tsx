import { ReactNode } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Detail = ({ children }: { children: ReactNode }) => {
  return (
    <Card className="basis-4/6 whitespace-nowrap">
      <CardHeader>
        <CardTitle>Student Detail</CardTitle>
        <CardDescription>Student Detail</CardDescription>
      </CardHeader>
      <CardContent className="">{children}</CardContent>
      <CardFooter className="flex justify-between"></CardFooter>
    </Card>
  );
};

export default Detail;

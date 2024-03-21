import { ReactNode } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

const List = ({children} : {children : ReactNode}) => {
  return (
    <Card className="basis-2/6 whitespace-nowrap">
      <CardHeader className='pb-2'>
        <CardTitle>Student List</CardTitle>
      </CardHeader>
      <CardContent className='overflow-auto max-h-[80%] px-2'>
        {children}
      </CardContent>
      <CardFooter className="flex justify-between">
      </CardFooter>
    </Card>
  )
}

export default List
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { SectionWithRMP } from "@/lib/sjsu/types";

export default function CourseInformation({section} : {section : SectionWithRMP}) {
  return (
    <Tabs defaultValue="account" className="w-[500px]">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="information" className = "">Information</TabsTrigger>
        <TabsTrigger value="description" className = "">Description</TabsTrigger>
        <TabsTrigger value="reviews" className = "">Reviews</TabsTrigger>
        
      </TabsList>
      <TabsContent value="information">
        <Card className = "bg-gradient-to-br from-slate-800 to-indigo-900 text-white">

          {/* <CardHeader>
            <CardTitle></CardTitle>
            <CardDescription>
    
            </CardDescription>
          </CardHeader> */}

          <CardContent className="space-y-2 flex items-center justify-center h-60">
              {/* Location will also specify if online. */}
              <div className = "">
                <h1 className = "text-2xl font-bold text-center text-amber-600">Location: {section.location}</h1>
                <div>
                  
                  <div className = "flex justify-center gap-10 m-3 text-xl">
                    <div className = "">
                      <p><b>Dates: </b>{section.dates}</p>
                      <p><b>Time: </b>{section.times}</p>
                      <p><b>Days: </b>{section.days}</p>
                    </div>

                    <div className = "">
                      <p><b>Credits: </b>{section.units}</p>
                      <p><b>Satisfies: </b>{section.satisfies}</p>
                      <p><b>Type: </b>{section.type}</p>
                    </div>
                  </div>
                </div>

                <p className = "text-center font-bold">Contact Instructor Email: <a className = "font-semibold">{section.instructor_email}</a></p>
                <p className = "text-center font-bold">Course Code: <a className = "font-semibold">{section.class_number}</a></p>
              </div>
          </CardContent>
          {/* <CardFooter>
            
          </CardFooter> */}
        </Card>
      </TabsContent>

      <TabsContent value="description">
        <Card className = "bg-gradient-to-br from-slate-800 to-indigo-900 text-white">

          <CardContent className="space-y-2 flex items-center justify-center h-60">
            <div className="space-y-1">
                place course description here.
            </div>
          </CardContent>

        </Card>
      </TabsContent>
      
      <TabsContent value="reviews">
        <Card className = "bg-gradient-to-br from-slate-800 to-indigo-900 text-white">

          <CardContent className="space-y-2 flex items-center justify-center h-60">
            <div className="space-y-1">
                reviews
            </div>
          </CardContent>

        </Card>
      </TabsContent>
  

    </Tabs>
  )
}

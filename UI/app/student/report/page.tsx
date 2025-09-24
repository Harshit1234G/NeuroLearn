import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, TrendingUp, BookOpen, Target, Lightbulb, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function StudentReport() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Brain className="size-8 text-primary" />
              <span className="text-2xl font-bold text-primary">NeuroLearn</span>
            </Link>
            <Button variant="outline" size="sm" asChild>
              <Link href="/student">
                <ArrowLeft className="mr-2 size-4" />
                Back to Dashboard
              </Link>
            </Button>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Your Learning Report</h1>
          <p className="text-xl text-muted-foreground">Detailed analysis of your progress and recommendations</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Performance Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Skills Assessment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg flex items-center justify-center">
                <img
                  src="/colorful-radar-chart-showing-listening-grasping-re.jpg"
                  alt="Skills Radar Chart"
                  className="w-full h-full object-contain"
                />
              </div>
            </CardContent>
          </Card>

          {/* Skill Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Skill Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Listening</span>
                  <span className="text-sm text-green-600 font-semibold">92%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: "92%" }}></div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Grasping</span>
                  <span className="text-sm text-blue-600 font-semibold">78%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: "78%" }}></div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Retention</span>
                  <span className="text-sm text-purple-600 font-semibold">85%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: "85%" }}></div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Application</span>
                  <span className="text-sm text-yellow-600 font-semibold">65%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-yellow-500 h-2 rounded-full" style={{ width: "65%" }}></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="size-5 text-yellow-500" />
              Personalized Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="size-5 text-green-600" />
                  <span className="font-semibold text-green-800">Strengths</span>
                </div>
                <p className="text-sm text-green-700">
                  Excellent listening skills! Continue with audio-based learning materials and podcasts.
                </p>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="size-5 text-yellow-600" />
                  <span className="font-semibold text-yellow-800">Focus Areas</span>
                </div>
                <p className="text-sm text-yellow-700">
                  Work on application skills with more practice problems and real-world examples.
                </p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen className="size-5 text-blue-600" />
                  <span className="font-semibold text-blue-800">Study Tips</span>
                </div>
                <p className="text-sm text-blue-700">
                  Try the spaced repetition technique to improve retention and understanding.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

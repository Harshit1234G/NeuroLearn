import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Brain, BookOpen, TrendingUp, Award, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function StudentDashboard() {
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
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">Welcome back, Alex!</span>
              <Button variant="outline" size="sm">
                Logout
              </Button>
            </div>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Welcome back, Alex! 🎉</h1>
          <p className="text-xl text-muted-foreground">Ready to continue your learning journey?</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-purple-100 to-purple-50 border-purple-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-700">Progress</CardTitle>
              <TrendingUp className="size-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-800">78%</div>
              <p className="text-xs text-purple-600">+12% from last week</p>
              <Progress value={78} className="mt-2" />
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-100 to-green-50 border-green-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-700">Strengths</CardTitle>
              <Award className="size-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-800">Math</div>
              <p className="text-xs text-green-600">92% accuracy</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-100 to-yellow-50 border-yellow-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-yellow-700">Weaknesses</CardTitle>
              <BookOpen className="size-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-800">Science</div>
              <p className="text-xs text-yellow-600">Needs practice</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-100 to-blue-50 border-blue-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-700">Last Session</CardTitle>
              <Brain className="size-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-800">85%</div>
              <p className="text-xs text-blue-600">Great job!</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Performance Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Your Learning Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg flex items-center justify-center">
                <img src="/colorful-learning-progress-chart-with-bars.jpg" alt="Progress Chart" className="w-full h-full object-contain" />
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Continue Learning</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                size="lg"
                className="w-full justify-between bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
                asChild
              >
                <Link href="/student/practice">
                  Start Practice Session
                  <ArrowRight className="size-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="w-full justify-between bg-transparent" asChild>
                <Link href="/student/report">
                  View Detailed Report
                  <ArrowRight className="size-5" />
                </Link>
              </Button>
              <div className="grid grid-cols-2 gap-4">
                <Button variant="secondary" className="bg-secondary/20 hover:bg-secondary/30">
                  Math Practice
                </Button>
                <Button variant="secondary" className="bg-accent/20 hover:bg-accent/30">
                  Science Review
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

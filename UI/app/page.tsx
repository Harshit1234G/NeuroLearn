import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Brain, BarChart3, Users, TrendingUp, Heart } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="size-8 text-primary" />
            <span className="text-2xl font-bold text-primary">NeuroLearn</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-primary">
              Sign In
            </Link>
            <Button size="sm">Get Started</Button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="mx-auto max-w-4xl">
          <h1 className="mb-6 text-5xl font-bold leading-tight text-balance">
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Adaptive AI Learning
            </span>
            <br />
            for Every Child
          </h1>
          <p className="mb-8 text-xl text-muted-foreground text-pretty">
            Personalized education that adapts to your child's unique learning style, empowering students, teachers, and
            parents with intelligent insights.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground" asChild>
              <Link href="/student">
                <BookOpen className="mr-2 size-5" />
                Student Portal
              </Link>
            </Button>
            <Button
              size="lg"
              variant="secondary"
              className="bg-secondary hover:bg-secondary/90 text-secondary-foreground"
              asChild
            >
              <Link href="/teacher">
                <Users className="mr-2 size-5" />
                Teacher Dashboard
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-accent text-accent hover:bg-accent hover:text-accent-foreground bg-transparent"
              asChild
            >
              <Link href="/parent">
                <Heart className="mr-2 size-5" />
                Parent Portal
              </Link>
            </Button>
          </div>

          {/* Illustration placeholder */}
          <div className="mx-auto max-w-2xl">
            <img
              src="/happy-children-learning-with-ai-robot-teacher-colo.jpg"
              alt="Children learning with AI"
              className="w-full h-auto rounded-2xl shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Powerful Features</h2>
          <p className="text-xl text-muted-foreground">Advanced AI technology that makes learning fun and effective</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="text-center hover:shadow-lg transition-shadow bg-gradient-to-br from-purple-100 to-purple-50 border-purple-200">
            <CardHeader>
              <div className="mx-auto mb-4 size-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Brain className="size-8 text-primary" />
              </div>
              <CardTitle className="text-primary">AI-Powered MCQs</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Intelligent questions that adapt to your learning pace and identify knowledge gaps automatically.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow bg-gradient-to-br from-green-100 to-green-50 border-green-200">
            <CardHeader>
              <div className="mx-auto mb-4 size-16 bg-secondary/10 rounded-full flex items-center justify-center">
                <TrendingUp className="size-8 text-secondary" />
              </div>
              <CardTitle className="text-secondary">Adaptive Testing</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Dynamic assessments that adjust difficulty based on performance, ensuring optimal challenge levels.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow bg-gradient-to-br from-yellow-100 to-yellow-50 border-yellow-200">
            <CardHeader>
              <div className="mx-auto mb-4 size-16 bg-accent/10 rounded-full flex items-center justify-center">
                <BarChart3 className="size-8 text-accent" />
              </div>
              <CardTitle className="text-accent">Smart Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Detailed analytics on learning progress, strengths, and areas for improvement with actionable insights.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Impact Section */}
      <section className="bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Making Learning Better</h2>
            <p className="text-xl text-muted-foreground">See the positive impact NeuroLearn is having on education</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">85%</div>
              <div className="text-lg font-medium mb-2">Improved Retention</div>
              <p className="text-muted-foreground">Students retain information better with adaptive learning</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-secondary mb-2">90%</div>
              <div className="text-lg font-medium mb-2">Teacher Satisfaction</div>
              <p className="text-muted-foreground">Teachers love the detailed insights and time savings</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-accent mb-2">95%</div>
              <div className="text-lg font-medium mb-2">Parent Engagement</div>
              <p className="text-muted-foreground">Parents stay involved with clear progress tracking</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-4xl font-bold mb-4">Ready to Transform Learning?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of students, teachers, and parents who are already experiencing the future of education.
          </p>
          <Button
            size="lg"
            className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
          >
            Start Free Trial
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted/30 py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Brain className="size-6 text-primary" />
            <span className="text-xl font-bold text-primary">NeuroLearn</span>
          </div>
          <p className="text-muted-foreground">
            © 2025 NeuroLearn. Empowering every child to reach their full potential.
          </p>
        </div>
      </footer>
    </div>
  )
}

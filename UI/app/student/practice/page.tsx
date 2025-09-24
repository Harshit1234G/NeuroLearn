"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Brain, ArrowRight, CheckCircle } from "lucide-react"
import Link from "next/link"

const sampleQuestions = [
  {
    id: 1,
    question: "What is the result of 15 + 27?",
    options: ["42", "41", "43", "40"],
    correct: 0,
  },
  {
    id: 2,
    question: "Which planet is closest to the Sun?",
    options: ["Venus", "Mercury", "Earth", "Mars"],
    correct: 1,
  },
  {
    id: 3,
    question: "What is the capital of France?",
    options: ["London", "Berlin", "Paris", "Madrid"],
    correct: 2,
  },
]

export default function PracticeSession() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [answers, setAnswers] = useState<number[]>([])
  const [showResult, setShowResult] = useState(false)

  const progress = ((currentQuestion + 1) / sampleQuestions.length) * 100

  const handleNext = () => {
    if (selectedAnswer !== null) {
      const newAnswers = [...answers, selectedAnswer]
      setAnswers(newAnswers)

      if (currentQuestion < sampleQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
        setSelectedAnswer(null)
      } else {
        setShowResult(true)
      }
    }
  }

  const correctAnswers = answers.filter((answer, index) => answer === sampleQuestions[index].correct).length
  const score = Math.round((correctAnswers / sampleQuestions.length) * 100)

  if (showResult) {
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
            </nav>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto mb-4 size-20 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="size-12 text-green-600" />
              </div>
              <CardTitle className="text-3xl">Great Job! 🎉</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="text-6xl font-bold text-primary mb-2">{score}%</div>
                <p className="text-lg text-muted-foreground">
                  You got {correctAnswers} out of {sampleQuestions.length} questions correct!
                </p>
              </div>

              <div className="space-y-4">
                <Button size="lg" className="w-full" asChild>
                  <Link href="/student">Return to Dashboard</Link>
                </Button>
                <Button variant="outline" size="lg" className="w-full bg-transparent">
                  Try Another Session
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

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
              <span className="text-sm text-muted-foreground">
                Question {currentQuestion + 1} of {sampleQuestions.length}
              </span>
            </div>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Progress</span>
            <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-balance">
              {sampleQuestions[currentQuestion].question}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {sampleQuestions[currentQuestion].options.map((option, index) => (
              <Button
                key={index}
                variant={selectedAnswer === index ? "default" : "outline"}
                size="lg"
                className="w-full justify-start text-left h-auto py-4 px-6"
                onClick={() => setSelectedAnswer(index)}
              >
                <span className="mr-4 font-semibold">{String.fromCharCode(65 + index)}.</span>
                {option}
              </Button>
            ))}
          </CardContent>
        </Card>

        {/* Next Button */}
        <div className="flex justify-center">
          <Button
            size="lg"
            onClick={handleNext}
            disabled={selectedAnswer === null}
            className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
          >
            {currentQuestion < sampleQuestions.length - 1 ? "Next Question" : "Submit"}
            <ArrowRight className="ml-2 size-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}

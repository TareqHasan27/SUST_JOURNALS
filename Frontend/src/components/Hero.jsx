import { BookOpen, GraduationCap } from 'lucide-react'
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const Hero = () => {
  const quotes = [
    {
      text: "Research is to see what everybody else has seen, and to think what nobody else has thought.",
      author: "Albert Szent-Györgyi"
    },
    {
      text: "The important thing is not to stop questioning. Curiosity has its own reason for existing.",
      author: "Albert Einstein"
    },
    {
      text: "In learning you will teach, and in teaching you will learn.",
      author: "Phil Collins"
    },
    {
      text: "Education is the most powerful weapon which you can use to change the world.",
      author: "Nelson Mandela"
    }
  ]

  const [currentQuote, setCurrentQuote] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % quotes.length)
    }, 6000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative w-full h-screen bg-green-50 overflow-hidden">
      <section className="w-full py-20">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            className="flex flex-col items-center space-y-4 text-center"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            {/* SUST Logo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="mb-8"
            >
              <img 
                src="https://images.seeklogo.com/logo-png/34/1/shahjalal-university-of-science-and-technology-logo-png_seeklogo-344200.png" 
                alt="SUST Logo" 
                className="h-30 w-30 object-contain"
              />
            </motion.div>

            <motion.div
              className="space-y-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ repeat: Infinity, duration: 3 }}
              >
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-white text-green-800 border border-green-200 text-sm font-medium mb-4">
                  <BookOpen className="w-3 h-3 mr-1" />
                  Shahjalal University of Science and Technology
                </div>
              </motion.div>

              <motion.h1
                className="text-green-700 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                SUST<span className="text-gray-800">JOURNALS</span>
              </motion.h1>

              <motion.p
                className="mx-auto max-w-[700px] text-gray-600 md:text-xl font-medium"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                Advancing Knowledge Through Academic Excellence
              </motion.p>

              {/* Rotating Quotes */}
              <div className="h-24 flex items-center justify-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentQuote}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.8 }}
                    className="mx-auto max-w-[800px] px-4"
                  >
                    <p className="text-sm md:text-base text-gray-700 italic mb-2">
                      "{quotes[currentQuote].text}"
                    </p>
                    <p className="text-xs md:text-sm text-green-700 font-semibold">
                      — {quotes[currentQuote].author}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Quote Indicators */}
              <div className="flex gap-2 justify-center mt-3">
                {quotes.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentQuote(index)}
                    className={`h-2 rounded-full transition-all ${
                      index === currentQuote 
                        ? 'w-8 bg-green-600' 
                        : 'w-2 bg-green-300 hover:bg-green-400'
                    }`}
                  />
                ))}
              </div>
            </motion.div>

            <motion.div
              className="flex items-center gap-2 text-sm text-green-800 mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              <GraduationCap className="w-5 h-5" />
              <span>Inspiring Research • Building Future • Creating Impact</span>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Hero
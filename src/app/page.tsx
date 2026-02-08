"use client"

import React, { useState } from 'react'
import { Inter } from 'next/font/google'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"

const inter = Inter({ subsets: ["latin"] })

export default function Home() {
  const [loading, setLoading] = useState(false)
  const [loadingText, setLoadingText] = useState("")

  const handleGenerate = async () => {
    setLoading(true)
    setLoadingText("正在提取字幕...")
    
    try {
      // 获取当前选择的值
      // 注意：这里需要状态管理来获取 Select 的值，暂时使用默认值演示
      // 实际开发中应该为 Select 组件添加 value 和 onValueChange 状态
      
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: (document.querySelector('input') as HTMLInputElement)?.value, // 临时获取 input 值，建议改用 state
          options: {
            count: 10,
            language: 'English',
            grade: 'Any'
          }
        }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.details ? `${data.error}: ${data.details}` : (data.error || 'Generation failed'));
      }

      console.log('Generated Data:', data);
      
      setLoadingText("生成成功！");
      // 可以在这里添加成功后的 UI 逻辑，例如隐藏输入框等
      
    } catch (error) {
      console.error('Error:', error);
      alert('生成失败: ' + (error as Error).message);
    } finally {
      setLoading(false);
      setLoadingText("");
    }
  }

  return (
    <div className={`min-h-screen bg-white text-[#1A1A1A] ${inter.className} flex flex-col`}>
      {/* 顶部导航 */}
      <nav className="flex items-center justify-between px-8 py-4 border-b border-gray-100">
        <div className="text-xl font-bold tracking-tight">VidQuiz</div>
        <Button variant="ghost" className="font-medium text-sm hover:bg-gray-100">Sign In</Button>
      </nav>

      {/* 核心区 */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 -mt-20">
        <div className="w-full max-w-2xl text-center space-y-8">
          
          <div className="space-y-4">
            <h1 className="text-5xl font-bold tracking-tight text-gray-900">
              YouTube to Blooket in Seconds
            </h1>
            <p className="text-xl text-gray-500">
              粘贴链接，一键生成游戏 Excel 模板
            </p>
          </div>

          <div className="space-y-4 pt-8">
            <div className="relative flex items-center">
              <Input 
                className="w-full h-[60px] text-lg px-6 rounded-xl border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-black/5" 
                placeholder="https://youtube.com/watch?v=..."
              />
              <div className="absolute right-2">
                <Button 
                  onClick={handleGenerate}
                  disabled={loading}
                  className="h-[44px] px-6 bg-black text-white hover:bg-gray-800 rounded-lg font-medium transition-all flex items-center"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : "Generate"}
                </Button>
              </div>
            </div>

            {loading && (
              <div className="text-sm text-gray-500 animate-pulse font-medium h-5">
                {loadingText}
              </div>
            )}
          </div>

          <div className="grid grid-cols-3 gap-4 pt-4">
            <Select defaultValue="english">
              <SelectTrigger className="h-12 bg-gray-50 border-transparent hover:bg-gray-100 transition-colors cursor-pointer">
                <SelectValue placeholder="Language: English" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="english">English</SelectItem>
                <SelectItem value="chinese">中文</SelectItem>
                <SelectItem value="spanish">Spanish</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="10">
              <SelectTrigger className="h-12 bg-gray-50 border-transparent hover:bg-gray-100 transition-colors cursor-pointer">
                <SelectValue placeholder="Questions: 10" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10 Questions</SelectItem>
                <SelectItem value="15">15 Questions</SelectItem>
                <SelectItem value="20">20 Questions</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="any">
              <SelectTrigger className="h-12 bg-gray-50 border-transparent hover:bg-gray-100 transition-colors cursor-pointer">
                <SelectValue placeholder="Grade: Any" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any Grade</SelectItem>
                <SelectItem value="k12">K-12</SelectItem>
                <SelectItem value="university">University</SelectItem>
              </SelectContent>
            </Select>
          </div>

        </div>
      </main>
    </div>
  )
}

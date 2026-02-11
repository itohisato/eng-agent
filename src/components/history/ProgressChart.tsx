'use client';

import { Card } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { Submission } from '@/types';

interface ProgressChartProps {
  submissions: Submission[];
}

export default function ProgressChart({ submissions }: ProgressChartProps) {
  // 古い順に並び替え
  const sorted = [...submissions].sort(
    (a, b) => new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime()
  );

  const chartData = sorted.map((sub) => {
    const date = new Date(sub.submittedAt);
    return {
      date: `${date.getMonth() + 1}/${date.getDate()}`,
      score: sub.scores.total,
      grammar: sub.scores.grammar,
      logic: sub.scores.logic,
      context: sub.scores.context,
      fluency: sub.scores.fluency,
    };
  });

  return (
    <Card className="p-6">
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50">
          <BarChart3 className="h-4 w-4 text-blue-600" />
        </div>
        <h3 className="font-semibold text-slate-900">スコア推移</h3>
      </div>

      {sorted.length === 0 ? (
        <p className="text-sm text-slate-500">まだ提出がありません</p>
      ) : (
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#64748b' }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: '#64748b' }} />
              <Tooltip
                contentStyle={{
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  fontSize: '12px',
                }}
                formatter={(value: number, name: string) => {
                  const labels: Record<string, string> = {
                    score: '総合スコア',
                    grammar: 'Grammar',
                    logic: 'Logic',
                    context: 'Context',
                    fluency: 'Fluency',
                  };
                  return [value, labels[name] || name];
                }}
              />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#2563eb"
                strokeWidth={2}
                dot={{ r: 4, fill: '#2563eb' }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
}

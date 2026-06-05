import React from 'react';

export const AnalyticsPage: React.FC = () => {
  const statCards = [
    { label: 'Total Queries', value: '42', change: '+12% this week', icon: 'chat' },
    { label: 'Avg Retrieval Latency', value: '248 ms', change: '-34ms optimization', icon: 'speed' },
    { label: 'Total Tokens Consumed', value: '184.2K', change: 'Input: 154K | Output: 30K', icon: 'token' },
    { label: 'Estimated Cost (USD)', value: '$0.32', change: 'Cost limit: $10.00 max', icon: 'payments' },
  ];

  const recentLogs = [
    { query: 'EMEA revenue contraction decline rate', doc: 'Global_Market_Analysis_Q3.pdf', chunks: 4, score: 0.92, latency: '215ms' },
    { query: 'Project Apollo engine specs and thrust', doc: 'Apollo_Specs_v2.pdf', chunks: 3, score: 0.88, latency: '260ms' },
    { query: 'Compliance cost environmental directives', doc: 'Global_Market_Analysis_Q3.pdf', chunks: 5, score: 0.95, latency: '280ms' },
    { query: 'Employee handbook vacation policies', doc: 'Handbook_2024.pdf', chunks: 2, score: 0.84, latency: '190ms' },
  ];

  return (
    <main className="flex-1 overflow-y-auto bg-surface flex flex-col items-center py-stack-lg px-margin-mobile md:px-gutter custom-scrollbar select-none">
      <div className="w-full max-w-container-max-width">
        {/* Page Header */}
        <div className="mb-stack-lg text-left">
          <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-stack-sm font-bold">
            System Performance Analytics
          </h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant">
            Monitor real-time search queries, context retrieval scores, token sizes, and pipeline costs.
          </p>
        </div>

        {/* Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-stack-md mb-stack-lg">
          {statCards.map((card, idx) => (
            <div key={idx} className="bg-surface-bright border border-outline-variant/40 rounded-xl p-stack-md shadow-sm text-left">
              <div className="flex justify-between items-center mb-stack-sm">
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
                  {card.label}
                </span>
                <span className="material-symbols-outlined text-secondary text-lg">
                  {card.icon}
                </span>
              </div>
              <h3 className="text-3xl font-bold text-on-surface font-headline-lg leading-none mb-1">
                {card.value}
              </h3>
              <p className="font-label-sm text-[10px] text-on-surface-variant font-medium">
                {card.change}
              </p>
            </div>
          ))}
        </div>

        {/* Bento Details: Quality Metric & Tokens bar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-stack-md mb-stack-lg text-left">
          {/* Retrieval Precision Bar */}
          <div className="lg:col-span-2 bg-surface-bright border border-outline-variant/40 rounded-xl p-stack-md shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="font-headline-md text-headline-md font-semibold text-on-surface border-b border-outline-variant/20 pb-unit">
                Index Retrieval Quality
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant mt-2">
                Retrieval precision evaluates how many of the Top-K fetched passages are marked relevant for synthesizing answers.
              </p>
            </div>
            
            <div className="space-y-stack-sm mt-4">
              <div className="flex justify-between items-end">
                <div>
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase font-semibold">Mean Average Precision (MAP)</span>
                  <p className="text-3xl font-bold text-secondary leading-none mt-1">94.6%</p>
                </div>
                <span className="font-label-sm text-label-sm text-emerald-500 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded">
                  Excellent
                </span>
              </div>
              <div className="w-full bg-surface-container-highest rounded-full h-2 overflow-hidden">
                <div className="bg-secondary h-2 rounded-full" style={{ width: '94.6%' }}></div>
              </div>
            </div>
          </div>

          {/* Model Breakdown */}
          <div className="bg-surface-bright border border-outline-variant/40 rounded-xl p-stack-md shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="font-headline-md text-headline-md font-semibold text-on-surface border-b border-outline-variant/20 pb-unit">
                API Breakdown
              </h3>
              <p className="font-label-sm text-label-sm text-on-surface-variant mt-2">
                Allocation of system costs across retrieval modules.
              </p>
            </div>

            <div className="space-y-2 mt-4">
              {[
                { name: 'LLM Generation (Gemini)', val: 78, color: 'bg-secondary' },
                { name: 'Vector Database (Index)', val: 15, color: 'bg-surface-tint' },
                { name: 'OCR & Parsing Engine', val: 7, color: 'bg-outline-variant' },
              ].map((item, idx) => (
                <div key={idx} className="space-y-0.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-on-surface">{item.name}</span>
                    <span className="font-semibold text-on-surface-variant">{item.val}%</span>
                  </div>
                  <div className="w-full bg-surface-container-highest rounded-full h-1">
                    <div className={`${item.color} h-1 rounded-full`} style={{ width: `${item.val}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Retrieval Operation Logs */}
        <div className="bg-surface-bright border border-outline-variant/40 rounded-xl shadow-sm overflow-hidden text-left">
          <div className="p-stack-md border-b border-outline-variant/30 bg-surface-container-lowest flex justify-between items-center">
            <h3 className="font-headline-md text-headline-md font-semibold text-on-surface">
              Recent Retrieval Operations
            </h3>
            <span className="font-label-sm text-label-sm bg-surface-container-low text-on-surface-variant px-3 py-1 rounded-full">
              Live API Logs
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] border-collapse text-left">
              <thead>
                <tr className="bg-surface-container-low border-b border-outline-variant/30 font-semibold text-xs text-on-surface-variant uppercase">
                  <th className="py-3 px-stack-md">Query Input</th>
                  <th className="py-3 px-stack-md">Matched Document</th>
                  <th className="py-3 px-stack-md text-center">Retrieved Passages</th>
                  <th className="py-3 px-stack-md text-center">Similarity Score</th>
                  <th className="py-3 px-stack-md text-right">Latency</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20 font-body-md text-body-md text-on-surface">
                {recentLogs.map((log, idx) => (
                  <tr key={idx} className="hover:bg-surface-container-low/30 transition-colors">
                    <td className="py-3 px-stack-md font-medium truncate max-w-xs" title={log.query}>
                      {log.query}
                    </td>
                    <td className="py-3 px-stack-md text-on-surface-variant truncate">
                      {log.doc}
                    </td>
                    <td className="py-3 px-stack-md text-center font-semibold text-secondary">
                      {log.chunks}
                    </td>
                    <td className="py-3 px-stack-md text-center font-semibold text-emerald-500">
                      {(log.score * 100).toFixed(0)}%
                    </td>
                    <td className="py-3 px-stack-md text-right text-on-surface-variant">
                      {log.latency}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
};

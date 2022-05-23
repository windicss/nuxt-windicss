import type { ListenOptions } from 'listhen'
import type { AnalysisOptions } from 'windicss-analysis'

export type AnalyzeOptions = true | false | {
  analysis?: AnalysisOptions
  server?: Partial<ListenOptions>
}

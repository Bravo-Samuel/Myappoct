import weeklyParashot from './weekly_parashot.json';
import jewishHolidays from './jewish_holidays.json';
import fastDays from './fast_days.json';
import hebrewMonths from './hebrew_months.json';
import omerData from './omer.json';
import prayerTimes from './prayer_times.json';
import jewishCustoms from './jewish_customs.json';
import bneiMenasheTraditions from './bnei_menashe_traditions.json';
import hebrewLanguage from './hebrew_language.json';
import jewishHistory from './jewish_history.json';

import { loadKnowledgeSourcesFromJSON } from './loader';
import { KnowledgeJSONFile } from './types';
import { KnowledgeSource, KnowledgeCategory } from '../../services/airabbi/providers/IKnowledgeProvider';

const allJSONFiles: KnowledgeJSONFile[] = [
  weeklyParashot as KnowledgeJSONFile,
  jewishHolidays as KnowledgeJSONFile,
  fastDays as KnowledgeJSONFile,
  hebrewMonths as KnowledgeJSONFile,
  omerData as KnowledgeJSONFile,
  prayerTimes as KnowledgeJSONFile,
  jewishCustoms as KnowledgeJSONFile,
  bneiMenasheTraditions as KnowledgeJSONFile,
  hebrewLanguage as KnowledgeJSONFile,
  jewishHistory as KnowledgeJSONFile
];

export const ALL_PRODUCTION_KNOWLEDGE_SOURCES: KnowledgeSource[] = allJSONFiles.flatMap(loadKnowledgeSourcesFromJSON);

export function getProductionKnowledgeSourcesByCategory(category: KnowledgeCategory): KnowledgeSource[] {
  return ALL_PRODUCTION_KNOWLEDGE_SOURCES.filter(source => source.category === category);
}

export function getProductionKnowledgeSourcesByTopicGroup(group: string): KnowledgeSource[] {
  const targetFile = allJSONFiles.find(f => f.topicGroup.toLowerCase() === group.toLowerCase());
  return targetFile ? loadKnowledgeSourcesFromJSON(targetFile) : [];
}

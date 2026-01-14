import { MoodState } from '../types';

export const MOOD_QUESTIONNAIRE = {
  sectionA: {
    title: 'Mania / Hypomania-leaning',
    description: 'Check all that apply to you today',
    items: [
      'I felt unusually "up," excited, or very irritable compared with my normal mood.',
      'I had noticeably more energy or was more physically or mentally active than usual.',
      'I needed less sleep than usual and still felt more energized than tired.',
      'My speech or thoughts felt unusually fast, or others had trouble keeping up with me.',
      'I did things that were more risky or impulsive than usual (for example, spending, sex, driving, substances, sudden big decisions).',
      'I spent more money than usual in a way that felt impulsive or hard to control (for example, buying things I do not need or cannot afford).',
      'I felt unusually confident or driven to achieve and found it hard to slow down or relax.',
      'I felt keyed up or over-activated (anxious, wired, or "amped up") while my energy was higher than usual.',
      'I felt unusually irritable or easily annoyed while my energy or activity level was higher than usual.',
    ],
  },
  sectionB: {
    title: 'Depression-leaning',
    description: 'Check all that apply to you today',
    items: [
      'I felt down, sad, or hopeless.',
      'I had much less interest or pleasure in activities I usually enjoy.',
      'I felt tired, heavy, or slowed down in my movements or thinking.',
      'I slept much more than usual or found it very hard to get out of bed.',
      'I avoided people or isolated myself more than usual.',
      'I had trouble concentrating, making decisions, or finishing tasks.',
      'I felt anxious or worried a lot of the time, even while my mood was low.',
      'I felt unusually irritable or easily annoyed while my mood was low.',
    ],
  },
  sectionC: {
    title: 'Mixed-features / Anxiety / Agitation',
    description: 'Check all that apply to you today',
    items: [
      'At the same time, I felt very "activated" or restless and also felt empty, sad, or hopeless.',
      'I felt strong urges to do things (be active, start projects, or act on impulses) while also feeling low or distressed about myself or my life.',
      'I felt very anxious, on edge, or unable to relax, even when nothing specific was happening.',
      'I felt inner tension or agitation (restless in my body, like I could not sit still), even while feeling low or distressed.',
    ],
  },
  sectionD: {
    title: 'Safety',
    description: 'This is important - please answer honestly',
    items: [
      'I had thoughts that I would be better off dead or of hurting myself in some way.',
    ],
  },
};

// Scoring thresholds from our spec
export const MOOD_THRESHOLDS = {
  mania: {
    low: 2,
    possible: 3,
    strong: 5,
  },
  depression: {
    low: 2,
    possible: 3,
    strong: 5,
  },
  mixed: {
    none: 0,
    possible: 1,
    strong: 3,
  },
};

// Mood state classification logic
export function classifyMoodState(scores: {
  mania: number;
  depression: number;
  mixed: number;
  safety: boolean;
}): MoodState {
  // Safety override - always takes precedence
  if (scores.safety) {
    return 'safety-alert';
  }
  
  // Likely elevated/hypomanic
  if (scores.mania >= 5 && scores.depression <= 3) {
    return 'elevated';
  }
  
  // Likely depressed
  if (scores.depression >= 5 && scores.mania <= 3) {
    return 'depressed';
  }
  
  // Possible mixed features
  if ((scores.mania >= 4 && scores.depression >= 4) || scores.mixed >= 2) {
    return 'mixed';
  }
  
  // Near baseline
  if (scores.mania <= 2 && scores.depression <= 2 && scores.mixed <= 1) {
    return 'baseline';
  }
  
  // Default to baseline if none of the above match
  return 'baseline';
}

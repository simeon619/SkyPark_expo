import { create } from 'zustand';
import { LabelInterface, SurveyInterface } from '../Descriptions';
import { SQuery } from '../..';

type surveySchema = {
  // listSurvey: Record<string, SurveyInterface & { labels: LabelInterface[] }>;
  listSurvey: Map<string, SurveyInterface & { labels: LabelInterface[] }>;
  loadingSurvey: boolean;
  initSurvey: () => void;

  setListSurvey: (surveyId: string) => void;
};

export const useSurveyStore = create<surveySchema>((set, get) => ({
  listSurvey: new Map(),
  loadingSurvey: false,
  initSurvey: () => {
    set(() => {
      return {
        listSurvey: new Map(),
        loadingSurvey: false,
      };
    });
  },
  setListSurvey: async (surveyId: string) => {
    const survey = await SQuery.newInstance('survey', { id: surveyId });
    if (!survey) return;
    const dataSurvey = survey.$cache;
    const parentId = survey.$parentId;
    if (!parentId) return;

    const labels = await SQuery.collector({
      label: dataSurvey.options,
      $option: {},
    });

    const arrayLabel = labels.label.map((lbl) => {
      return lbl.$cache;
    });
    Promise.all(
      labels.label.map((labelItem) => {
        labelItem.when('refresh', (newlabel) => {
          set((state) => {
            const updatedSurvey = state.listSurvey.get(parentId);
            if (!updatedSurvey) return state;
            const index = updatedSurvey.labels.findIndex((item) => item._id === labelItem.$id);
            if (index !== undefined && index !== -1) {
              updatedSurvey.labels[index] = { ...updatedSurvey?.labels[index], ...newlabel };
            }
            return {
              listSurvey: new Map<string, SurveyInterface & { labels: LabelInterface[] }>(state.listSurvey).set(
                parentId,
                updatedSurvey
              ),
            };
          });
        });
      })
    );

    set((state) => {
      const updatedListSurvey = new Map(state.listSurvey);
      updatedListSurvey.set(parentId, {
        ...dataSurvey,
        labels: arrayLabel,
      });
      return {
        listSurvey: updatedListSurvey,
      };
    });
  },
}));

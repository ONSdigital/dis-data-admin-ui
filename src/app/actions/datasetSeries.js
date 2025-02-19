'use server'

import { cookies } from "next/headers";

import { httpPost, SSRequestConfig } from "@/utils/request/request";

export async function createDatasetSeries(currentstate, formData) {
    const datasetSeries = {
        title: formData.get('datasetSeriesTitle'),
        id: formData.get('datasetSeriesID'),
        description: formData.get('datasetSeriesDescription'),
        contacts: JSON.parse(formData.get('datasetSeriesContacts'))
      }

    const reqCfg = await SSRequestConfig(cookies);

    try {
      const data = await httpPost(reqCfg, "/datasets", datasetSeries);
      if (data.id) {
        return "success"
      } 
    } catch (err) {
      return err.toString();
    }
}


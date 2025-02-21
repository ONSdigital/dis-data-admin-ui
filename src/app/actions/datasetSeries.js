'use server'

import { cookies } from "next/headers";

import { httpPost, SSRequestConfig } from "@/utils/request/request";

import { z } from "zod";
 
const schema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  id: z.string().min(1, { message: "ID is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  contacts: z.array(z.object({
    name: z.string(),
    email: z.string()
  })).min(1, { message: "A contact is required" })
})

export async function createDatasetSeries(currentstate, formData) {
  const datasetSeriesSubmission = {
      title: formData.get('datasetSeriesTitle'),
      id: formData.get('datasetSeriesID'),
      description: formData.get('datasetSeriesDescription'),
      contacts: JSON.parse(formData.get('datasetSeriesContacts'))
  }

  let response = {}
  const result = schema.safeParse(datasetSeriesSubmission)

  if (!result.success) {
    response = {
      success: result.success,
      errors: result.error.flatten().fieldErrors,
      submission: datasetSeriesSubmission
    }
    return response
  } else {
    response = {
      success: result.success,
      recentlySumbitted: true
    }
    const reqCfg = await SSRequestConfig(cookies);

    try {
      const data = await httpPost(reqCfg, "/datasets", datasetSeriesSubmission);
      if (data.id) {
        return response
      } else if (data.status == 403) {
        response = {
          success: false,
          recentlySumbitted: false,
          code: data.status
        }
        return response
      }
    } catch (err) {
      return err.toString();
    }
  }
}


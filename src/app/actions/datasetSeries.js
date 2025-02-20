'use server'

import { cookies } from "next/headers";

import { httpPost, SSRequestConfig } from "@/utils/request/request";

import { z } from 'zod'
 
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
    const datasetSeries = {
        title: formData.get('datasetSeriesTitle'),
        id: formData.get('datasetSeriesID'),
        description: formData.get('datasetSeriesDescription'),
        contacts: JSON.parse(formData.get('datasetSeriesContacts'))
    }

    let response = {}
    const result = schema.safeParse(datasetSeries)

    if (!result.success) {
      response = {
        success: result.success,
        errors: result.error.flatten().fieldErrors,
      }
      return response
    } else {
      response = {
        success: result.success
      }
      const reqCfg = await SSRequestConfig(cookies);

      try {
        const data = await httpPost(reqCfg, "/datasets", datasetSeries);
        if (data.id) {
          return response
        } else {
          return "Server Denied Your Submission"
        }
      } catch (err) {
        return err.toString();
      }
    }
}


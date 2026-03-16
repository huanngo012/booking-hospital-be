import { PipelineStage } from 'mongoose'

type SortOrder = 1 | -1

interface LookupOption {
  from: string
  localField?: string
  foreignField?: string
  let?: Record<string, unknown>
  pipeline?: PipelineStage.Lookup['$lookup']['pipeline']
  as: string
  unwind?: boolean
}

interface BuildAggregateOptions<TFilter extends Record<string, unknown>> {
  filter?: TFilter
  search?: Record<string, string>
  lookup?: LookupOption[]
  sort?: string
  fields?: string
  page?: number
  limit?: number
}

interface AggregateResult<T> {
  data: T[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export function buildAggregateQuery<TFilter extends Record<string, unknown>>({
  filter,
  search,
  lookup,
  sort,
  fields,
  page,
  limit
}: BuildAggregateOptions<TFilter>): PipelineStage[] {
  const pipeline: PipelineStage[] = []

  const pageNumber = Math.max(1, Number(page) || 1)
  const limitNumber = Math.max(1, Number(limit) || Number(process.env.LIMIT) || 10)
  const skip = (pageNumber - 1) * limitNumber

  if (filter) {
    pipeline.push({
      $match: filter
    })
  }

  if (lookup?.length) {
    lookup.forEach((item) => {
      if (item.pipeline) {
        pipeline.push({
          $lookup: {
            from: item.from,
            let: item.let,
            pipeline: item.pipeline,
            as: item.as
          }
        })
      } else {
        pipeline.push({
          $lookup: {
            from: item.from,
            localField: item.localField,
            foreignField: item.foreignField,
            as: item.as
          }
        })
      }

      if (item.unwind) {
        pipeline.push({
          $unwind: {
            path: `$${item.as}`,
            preserveNullAndEmptyArrays: true
          }
        })
      }
    })
  }

  if (search && Object.keys(search).length) {
    pipeline.push({
      $match: {
        $and: Object.entries(search).map(([field, keyword]) => ({
          [field]: {
            $regex: keyword,
            $options: 'i'
          }
        }))
      }
    })
  }

  if (fields) {
    const project: Record<string, 0 | 1> = {}

    fields.split(',').forEach((field) => {
      const trimmed = field.trim()

      if (trimmed.startsWith('-')) {
        project[trimmed.substring(1)] = 0
      } else {
        project[trimmed] = 1
      }
    })

    pipeline.push({ $project: project })
  }

  if (sort) {
    const sortObj: Record<string, SortOrder> = {}

    sort.split(',').forEach((field) => {
      const trimmed = field.trim()

      if (trimmed.startsWith('-')) {
        sortObj[trimmed.substring(1)] = -1
      } else {
        sortObj[trimmed] = 1
      }
    })

    pipeline.push({ $sort: sortObj })
  }

  pipeline.push({
    $facet: {
      data: [{ $skip: skip }, { $limit: limitNumber }],
      total: [{ $count: 'count' }]
    }
  })

  return pipeline
}

export function formatAggregateResult<T>(
  result: {
    data: T[]
    total: { count: number }[]
  }[],
  page?: number,
  limit?: number
): AggregateResult<T> {
  const data = result[0]?.data ?? []
  const total = result[0]?.total[0]?.count ?? 0

  const pageNumber = Math.max(1, Number(page) || 1)
  const limitNumber = Math.max(1, Number(limit) || Number(process.env.LIMIT) || 10)

  return {
    data,
    pagination: {
      total,
      page: pageNumber,
      limit: limitNumber,
      totalPages: Math.ceil(total / limitNumber)
    }
  }
}

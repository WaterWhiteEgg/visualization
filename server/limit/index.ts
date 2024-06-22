import { rateLimit } from 'express-rate-limit'


export const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 分钟
	limit: 100, // 每个IP每 `window` （这里指每15分钟）限制至100次请求。
	standardHeaders: 'draft-7', // draft-6: `RateLimit-*` 头；draft-7: 合并后的 `RateLimit` 头
	legacyHeaders: false, // 禁用 `X-RateLimit-*` 头。
	// store: ... , // 如Redis, Memcached等数据存储。参见下文。
})
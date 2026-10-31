# Caching Strategy

## Overview

Redis is used as a temporary caching layer. It should never be considered the source of truth.

## Caching Principles

1. **Temporary Infrastructure**: Redis is for performance optimization only
2. **Cache Invalidation**: Cache must be invalidated when underlying data changes
3. **Data Consistency**: All reads must be able to bypass the cache when needed

## Key Namespacing

Cache keys follow this pattern:

```
<namespace>:<entity_type>:<entity_id>
```

Example:
```
user:profile:123
problems:list:10:0
submissions:user:123:problem:456
```

## Time-to-Live (TTL)

1. **Short-lived data**: 5-30 minutes
2. **Medium-lived data**: 1-6 hours
3. **Long-lived data**: 12-24 hours

TTLs should be set conservatively and adjusted based on actual usage patterns.

## Invalidation Strategy

1. **Write-through**: Update cache on data changes
2. **Time-based**: Invalidate based on TTL
3. **Event-based**: Invalidate when relevant events occur

## Implementation Considerations

1. **Cache-aside pattern**: Application queries cache first, falls back to database
2. **Write-behind**: Updates are written to database first, then to cache
3. **Cache stampede protection**: Use locks or probabilistic early expiration

## Redis Configuration

1. **Connection pooling**: Configured for high concurrency
2. **Persistence**: Disabled (temporary infrastructure)
3. **Memory management**: Configured to evict old data when memory limits are reached
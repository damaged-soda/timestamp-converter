import { ActionPanel, Detail, Action, List } from "@raycast/api";
import React, { useState, useEffect } from "react";
import { format, parseISO, isValid, getTime, parse } from "date-fns";

interface ConversionResult {
  inputType: "timestamp" | "date" | "invalid";
  timestamp?: number;
  dateString?: string;
  formattedDate?: string;
}

export default function Command() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<ConversionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!input.trim()) {
      setResult(null);
      return;
    }

    setIsLoading(true);
    const conversionResult = convertInput(input.trim());
    setResult(conversionResult);
    setIsLoading(false);
  }, [input]);

  function convertInput(input: string): ConversionResult {
    try {
      let date = parseISO(input);
      if (isValid(date)) {
        return {
          inputType: "date",
          timestamp: getTime(date),
          dateString: input,
          formattedDate: format(date, "yyyy-MM-dd HH:mm:ss"),
        };
      }

      date = parse(input, "yyyyMMdd", new Date());
      if (isValid(date)) {
        return {
          inputType: "date",
          timestamp: getTime(date),
          dateString: format(date, "yyyy-MM-dd"),
          formattedDate: format(date, "yyyy-MM-dd HH:mm:ss"),
        };
      }

      date = new Date(input);
      if (isValid(date)) {
        return {
          inputType: "date",
          timestamp: getTime(date),
          dateString: date.toISOString(),
          formattedDate: format(date, "yyyy-MM-dd HH:mm:ss"),
        };
      }
    } catch (e) {}

    if (/^\d+$/.test(input)) {
      const rawTimestamp = parseInt(input, 10);
      let timestamp = rawTimestamp;
      // 判断是否为秒级时间戳（小于 10^11）
      if (rawTimestamp < 1e11) {
        timestamp = rawTimestamp * 1000;
      }
      const date = new Date(timestamp);
      if (isValid(date)) {
        return {
          inputType: "timestamp",
          timestamp,
          dateString: date.toISOString(),
          formattedDate: format(date, "yyyy-MM-dd HH:mm:ss"),
        };
      }
    }

    return { inputType: "invalid" };
  }

  return (
    <List
      isLoading={isLoading}
      searchBarPlaceholder="输入时间戳或日期字符串..."
      onSearchTextChange={setInput}
      throttle
    >
      {result?.inputType === "invalid" && (
        <List.EmptyView title="无效输入" description="请输入有效的时间戳或日期字符串" />
      )}

      {result?.inputType === "timestamp" && result.formattedDate && (
        <List.Section title="转换结果">
          <List.Item
            title="日期字符串"
            subtitle={result.formattedDate}
            actions={
              <ActionPanel>
                <Action.CopyToClipboard content={result.formattedDate} />
              </ActionPanel>
            }
          />
          <List.Item
            title="ISO 格式"
            subtitle={result.dateString || ""}
            actions={
              <ActionPanel>
                <Action.CopyToClipboard content={result.dateString || ""} />
              </ActionPanel>
            }
          />
          <List.Item
            title="北京时间"
            subtitle={format(new Date(result.timestamp ?? 0), "yyyy-MM-dd HH:mm:ss", { timeZone: "Asia/Shanghai" })}
            actions={
              <ActionPanel>
                <Action.CopyToClipboard content={format(new Date(result.timestamp ?? 0), "yyyy-MM-dd HH:mm:ss", { timeZone: "Asia/Shanghai" })} />
              </ActionPanel>
            }
          />
          <List.Item
            title="UTC 时间"
            subtitle={new Date(result.timestamp ?? 0).toISOString().replace("T", " ").replace("Z", "")}
            actions={
              <ActionPanel>
                <Action.CopyToClipboard content={new Date(result.timestamp ?? 0).toISOString().replace("T", " ").replace("Z", "")} />
              </ActionPanel>
            }
          />
          <List.Item
            title="原始时间戳"
            subtitle={result.timestamp?.toString() || ""}
            actions={
              <ActionPanel>
                <Action.CopyToClipboard content={result.timestamp?.toString() || ""} />
              </ActionPanel>
            }
          />
          <List.Item
            title="时间戳 (秒)"
            subtitle={(Math.floor((result.timestamp ?? 0) / 1000)).toString()}
            actions={
              <ActionPanel>
                <Action.CopyToClipboard content={(Math.floor((result.timestamp ?? 0) / 1000)).toString()} />
              </ActionPanel>
            }
          />
        </List.Section>
      )}

      {result?.inputType === "date" && result.timestamp && (
        <List.Section title="转换结果">
          <List.Item
            title="时间戳 (毫秒)"
            subtitle={result.timestamp.toString()}
            actions={
              <ActionPanel>
                <Action.CopyToClipboard content={result.timestamp.toString()} />
              </ActionPanel>
            }
          />
          <List.Item
            title="时间戳 (秒)"
            subtitle={(Math.floor(result.timestamp / 1000)).toString()}
            actions={
              <ActionPanel>
                <Action.CopyToClipboard content={(Math.floor(result.timestamp / 1000)).toString()} />
              </ActionPanel>
            }
          />
          <List.Item
            title="格式化日期"
            subtitle={result.formattedDate || ""}
            actions={
              <ActionPanel>
                <Action.CopyToClipboard content={result.formattedDate || ""} />
              </ActionPanel>
            }
          />
          <List.Item
            title="ISO 格式"
            subtitle={result.dateString || ""}
            actions={
              <ActionPanel>
                <Action.CopyToClipboard content={result.dateString || ""} />
              </ActionPanel>
            }
          />
          <List.Item
            title="北京时间"
            subtitle={format(new Date(result.timestamp ?? 0), "yyyy-MM-dd HH:mm:ss", { timeZone: "Asia/Shanghai" })}
            actions={
              <ActionPanel>
                <Action.CopyToClipboard content={format(new Date(result.timestamp ?? 0), "yyyy-MM-dd HH:mm:ss", { timeZone: "Asia/Shanghai" })} />
              </ActionPanel>
            }
          />
          <List.Item
            title="UTC 时间"
            subtitle={new Date(result.timestamp ?? 0).toISOString().replace("T", " ").replace("Z", "")}
            actions={
              <ActionPanel>
                <Action.CopyToClipboard content={new Date(result.timestamp ?? 0).toISOString().replace("T", " ").replace("Z", "")} />
              </ActionPanel>
            }
          />
        </List.Section>
      )}
    </List>
  );
}
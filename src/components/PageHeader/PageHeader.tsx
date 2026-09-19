import { Icon } from "@/src/components/Icon";
import * as styles from "./PageHeader.styles";
import type { PageHeaderProps } from "./PageHeader.types";

export function PageHeader({
  title,
  mobileTitle,
  description,
  icon,
  meta,
  action,
}: PageHeaderProps) {
  return (
    <styles.Root>
      <div>
        <styles.Heading>
          {icon && (
            <styles.Glyph>
              <Icon name={icon} size={28} />
            </styles.Glyph>
          )}
          <styles.Title>
            <styles.WideTitle>{title}</styles.WideTitle>
            <styles.NarrowTitle>{mobileTitle ?? title}</styles.NarrowTitle>
          </styles.Title>
        </styles.Heading>
        {description && <styles.Description>{description}</styles.Description>}
      </div>
      {(meta || action) && (
        <styles.Controls>
          {meta}
          {action}
        </styles.Controls>
      )}
    </styles.Root>
  );
}

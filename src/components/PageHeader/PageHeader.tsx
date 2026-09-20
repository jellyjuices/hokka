import { Icon } from "@/src/components/Icon";
import { ArrowLeftIcon } from "@phosphor-icons/react/dist/ssr";
import {
  HeaderBack,
  HeaderBar,
  HeaderControls,
  HeaderDescription,
  HeaderGlyph,
  HeaderHeading,
  HeaderNarrowTitle,
  HeaderTitle,
  HeaderTitleBlock,
  HeaderWideTitle,
  ActionWrappper,
} from "./PageHeader.styles";
import type { PageHeaderProps } from "./PageHeader.types";

export function PageHeader({
  title,
  backHref,
  mobileTitle,
  description,
  icon,
  meta,
  action,
}: PageHeaderProps) {
  return (
    <HeaderBar>
      <HeaderTitleBlock>
        <HeaderHeading>
          {backHref && (
            <HeaderBack href={backHref} aria-label="Go back">
              <Icon name={ArrowLeftIcon} size={28} />
            </HeaderBack>
          )}
          {icon && (
            <HeaderGlyph>
              <Icon name={icon} size={28} />
            </HeaderGlyph>
          )}
          <HeaderTitle>
            <HeaderWideTitle>{title}</HeaderWideTitle>
            <HeaderNarrowTitle>{mobileTitle ?? title}</HeaderNarrowTitle>
          </HeaderTitle>
        </HeaderHeading>
        {description && <HeaderDescription>{description}</HeaderDescription>}
      </HeaderTitleBlock>
      {(meta || action) && (
        <HeaderControls>
          {meta}
          <ActionWrappper>{action}</ActionWrappper>
        </HeaderControls>
      )}
    </HeaderBar>
  );
}

import type { BoxProps } from '@mui/material/Box';

import { m } from 'framer-motion';
import { varAlpha } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { CONFIG } from 'src/global-config';
import { useAuthContext } from 'src/auth/hooks';
import { Divider } from '@mui/material';
// ----------------------------------------------------------------------

export function NavUpgrade({ sx, ...other }: BoxProps) {
  const { user } = useAuthContext();
  return (
    <Box
      sx={[{ px: 2, py: 1, textAlign: 'center' }, ...(Array.isArray(sx) ? sx : [sx])]}
      {...other}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
        <Box sx={{ mb: 1, mt: 1.5, width: 1 }}>

          <Typography
            variant="body2"
            noWrap
            // sx={{ color: 'var(--layout-nav-text-disabled-color)' }}
            sx={{ mb: 1, color: 'var(--layout-nav-text-primary-color)' }}
          // bgcolor={'b9e2f5'}
          >
            {user?.role} :  {user?.name}
          </Typography>
          <Typography
            variant="body2"
            noWrap
            sx={{ mb: 1, color: 'var(--layout-nav-text-primary-color)' }}
          >
            {user?.email}
          </Typography>
          <br></br>
          {/* <Divider /> */}
          <Typography
            variant="subtitle2"
            noWrap
            sx={{ color: 'var(--layout-nav-text-disabled-color)' }}
          >
            For Support: 94879 35315
          </Typography>

          <Typography
            variant="body2"
            noWrap
            sx={{ color: 'var(--layout-nav-text-disabled-color)' }}
          >
            IT Department
          </Typography>



        </Box>
      </Box>
    </Box>
  );
}

// ----------------------------------------------------------------------

export function UpgradeBlock({ sx, ...other }: BoxProps) {
  return (
    <Box
      sx={[
        (theme) => ({
          ...theme.mixins.bgGradient({
            images: [
              `linear-gradient(135deg, ${varAlpha(theme.vars.palette.error.lightChannel, 0.92)}, ${varAlpha(theme.vars.palette.secondary.darkChannel, 0.92)})`,
              `url(${CONFIG.assetsDir}/assets/background/background-7.webp)`,
            ],
          }),
          px: 3,
          py: 4,
          borderRadius: 2,
          position: 'relative',
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <Box
        sx={(theme) => ({
          top: 0,
          left: 0,
          width: 1,
          height: 1,
          borderRadius: 2,
          position: 'absolute',
          border: `solid 3px ${varAlpha(theme.vars.palette.common.whiteChannel, 0.16)}`,
        })}
      />

      <Box
        component={m.img}
        animate={{ y: [12, -12, 12] }}
        transition={{
          duration: 8,
          ease: 'linear',
          repeat: Infinity,
          repeatDelay: 0,
        }}
        alt="Small Rocket"
        src={`${CONFIG.assetsDir}/assets/illustrations/illustration-rocket-small.webp`}
        sx={{
          right: 0,
          width: 112,
          height: 112,
          position: 'absolute',
        }}
      />

      <Box
        sx={{
          display: 'flex',
          position: 'relative',
          flexDirection: 'column',
          alignItems: 'flex-start',
        }}
      >
        <Box component="span" sx={{ typography: 'h5', color: 'common.white' }}>
          JESUS REDEEMS
        </Box>

        <Box
          component="span"
          sx={{
            mb: 2,
            mt: 0.5,
            color: 'common.white',
            typography: 'subtitle2',
          }}
        >
          Spread the Revival Fire
        </Box>


      </Box>
    </Box>
  );
}
